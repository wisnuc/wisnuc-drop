/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   storeFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/27 16:07:12 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/09 15:27:51 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')
const formidable = require('formidable')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')
const socketIOHandler = require('./socketIOHandler')

// const fs = require('fs')
// const tmpWriteStream = fs.createWriteStream(process.cwd() + '/tmp/1.jpg')

/**
 * store file 
	notication: 
	1. filed 处理 
	2. 并发请求
	3. buffer []
	@module StoreFile
*/

/**
 * formidable upload file - server 
 * @class Server 
 * @extends {EventEmitter}
 */
class Server extends threadify(EventEmitter) {

	constructor(req, res) {
		super()
		this.req = req
		this.res = res
		this.jobId = uuid.v4()
		this.timer = Date.now()  + 15 * 1000
		this.buffers = []
		// req error
		this.req.on('error', err => this.error(err))
	}
	
	// formidable
	async run() {
		let stationId = this.req.params.id
		let user = this.req.auth.user
		let form = new formidable.IncomingForm()
		
		// define formEnded action 
		this.defineSetOnce('formEnded', () => {
			// this.ws exist and this.buffers = null
			if (this.ws && !this.buffers) {
				this.ws.end() // station response end 
			}
		})

		// until ws come in, emit different action
		this.defineSetOnce('ws', () => {
			// if formEnded = true, this.ws.end()
			if (this.formEnded) {
				this.buffers.forEach((buf) => this.ws.write(buf))
				this.ws.end()
			}
			else {
				this.buffers.forEach((buf) => this.ws.write(buf))
				this.buffers = null
				form.resume()
			}
		})
	
		form.onPart = part => {
			if (!part.filename) {
				// let formidable handle all non-file parts
				return form.handlePart(part)
			}
			form.pause()
			part.on('data', data => {
				if (this.ws) {
					this.ws.write(data)
				}
				else {
					this.buffers.push(data)
				}
			})
			part.on('end', () => {})
			part.on('error', () => {})
		}
		// analysis field
		form.on('field', async (field, value) => {
			try {
				if (field == 'manifest') {
					let body = JSON.parse(value)
					let method, resource
					method = body.method
					resource = body.resource
					delete body.method
					delete body.resource
					let manifest = Object.assign({},
						{
							method: method,
							resource: resource,
							body: body,
							sessionId: this.jobId,
							user: {
								id: user.id,
								nickName: user.nickName,
								unionId: user.unionId
							}
						}
					)
					// this.replay(tmpWriteStream)
					await this.notice(stationId, manifest)
				} 
				else {
					this.error(new Error('no manifest field'))
				}
			}
			catch (err) {
				this.error(err)
			}
		})

		form.on('aborted', () => this.error(new Error('request aborted')))
		form.on('error', () => this.error(new Error('form error')))
		// last event 
		form.on('end', () => this.formEnded = true)
		form.parse(this.req)
	}

	/**
	 * find matched station, and send message
	 * @param {string} stationId 
	 * @param {object} manifest - queryString
	 * @memberof Server
	 */
	async notice(stationId, manifest) {
		await socketIOHandler.pipe(stationId, manifest)
	}
	
	/**
	 * station repay
	 * @param {any} writeStream 
	 * @memberof Server
	 */
	repay(writeStream) {
		// this.ws 是个转折点
		this.ws = writeStream 
	}
	
	isTimeOut() {
		if (Date.now() > this.timer) {
			let e = new Error('response time more than 15s')
			this.error(e)
			return true
		}
		return false
	}

	finished() {
		return this.res.finished
	}

	success(data) {
		if (this.finished()) return
		this.res.success(data)
	}

	error(err, code) {
		if (this.finished()) return
		this.res.error(err, code)
	}
}


/**
 * formidable upload file
 * @class StoreFile
 * @extends {threadify(EventEmitter)}
 */
class StoreFile extends threadify(EventEmitter) {
	
	constructor(limit) {
		super()
		this.limit = limit || 1024 
		this.map = new Map()
		// global handle map
		setInterval(() => {
			if (this.map.size === 0) return 
			this.schedule() 
		}, 30000)
	}
	
	// schedule
	schedule() {
		this.map.forEach((v, k) => {
			if(v.finished()) this.map.delete(k)
		})
	}

	request(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('storeFile queue no server')
		// timeout
		if (server.isTimeOut() || server.finished()) {
			let e = new Error('response time more than 15s')
			// end
			this.close(jobId)
			return res.error(e)
		}
		// repay
		server.repay(res)
		// req error
		req.on('error', err => {
			// response
			res.error(err)
			server.error(err)
		})
	}

	createServer(req, res) {
		this.schedule()
		console.warn('store size: ', this.map.size);
		if (this.map.size > this.limit) 
			throw new Error('too many tasks being processed, please try again later!')
		let server = new Server(req, res)
		this.map.set(server.jobId, server)
		return server
	}
	/**
	 * response store error to client
	 * @param {any} req 
	 * @param {any} res 
	 * @memberof StoreFile
	 */
	response(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('storeFile queue no server')
		// finished
		if (server.finished()) return res.end()

		let { error, data } = req.body
		// if error exist, server.error()
		if (error) {
			let { message, code } = error
			server.error(message, code)
		}
		else {
			server.success(data)
		}
		res.success()
		// end
		this.close(jobId)
	}
	/**
	 * close life cycle of the instance
	 * @param {any} jobId 
	 * @param {any} err
	 * @memberof StoreFile
	 */
	close(jobId) {
		let server = this.map.get(jobId)
		if (!server) return 
		// delete map
		this.map.delete(jobId)
	}
}

module.exports = new StoreFile(10000)
