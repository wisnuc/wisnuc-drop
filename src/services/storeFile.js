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

/**
 * store file 
	notication: 
	1. filed 处理 
	2. 并发请求
	3. buffer []
	4. if client does`t come in, how to abort this server ???
	@module StoreFile
*/

/**
 * formidable upload file - server 
 * @class Server 
 * @extends {EventEmitter}
 */
class Server extends threadify(EventEmitter) {

	constructor() {
		super()
		this.jobId = uuid.v4()
		// 3s 与 buffers 相同生命周期, 等待 get res strem 的接入
		this.timer = Date.now() + 3000 
		this.buffers = []
	}
	
	/**
	 * formidable 
	 * @param {any} req 
	 * @param {any} res 
	 * @memberof Server
	 */
	run(req, res) {

		let stationId = req.params.id
		let user = req.auth.user
		let form = new formidable.IncomingForm()
		// handle error
		this.defineSetOnce('error', () => res.error(this.error))
		// client response end
		this.defineSetOnce('resEnded', () => res.end())
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
				form.handlePart(part)
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
				try {
					await this.notice(stationId, manifest)
				}
				catch(err) {
					this.error = err
				}
			}
			else {
				this.abort(('no manifest field'))
			}
		})

		form.on('aborted', () => this.abort(new Error('request aborted')))
		form.on('error', () => this.abort(new Error('form error')))
		// last event 
		form.on('end', () => this.formEnded = true)
		form.parse(req)

		/**
		 this.until(() => !!this.ws)
			.then(() => {
				this.buffers.forEach((buf) => this.ws.write(buf))
				this.buffers = null
				this.clearTimeOut()
				form.resume()
				
				this.until(() => this.formEnded)
					.then(() => this.ws.end())
					.catch(e => {
						console.log('unitl error');
					})
				
			})
			.catch(e => this.finish())
		 */
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
	 * station replay
	 * @param {any} stream 
	 * @memberof Server
	 */
	replay(stream) {
		// this.ws 是个转折点
		this.ws = stream 
		// FIXME: add timer, await station operation response 
	}
	
	isTimeOut() {
		return Date.now() > this.timer ? true : false
	}

	clearTimeOut() {
		this.timer = null	
	}
	
	finish() {
		this.resEnded = true
	}

	abort(err) {
    this.error = err || new Error('client aborted')
  }
}


/**
 * formidable upload file
 * @class StoreFile
 * @extends {threadify(EventEmitter)}
 */
class StoreFile extends threadify(EventEmitter) {
	
	constructor() {
		super()
		this.limit = 40 // limit 
		this.map = new Map()
	}
	
	/**
	 * find server
	 * @param {any} jobId 
	 * @param {any} res 
	 * @returns 
	 * @memberof StoreFile
	 */
	request(req, res) {
		let jobId = req.params.jobId
		let server = this.getServer(jobId)
		if (!server) return res.error('storeFile queue no server')
		// timeout, notice both side to res.end
		if (server.isTimeOut()) {
			let e = new Error('station: GET request timeout')
			server.abort(e)
			return res.error(e)
		}
		server.replay(res)
		req.on('close', () => {
			this.abort(jobId)
		})
	}

	createServer() {
		if (this.map.size > this.limit) 
			throw new Error('正在处理的任务过多,请稍后再试')
		let server = new Server()
		this.map.set(server.jobId, server)
		return server
	}
	
	getServer(jobId) {
		return this.map.get(jobId)
	}
	
	finish(jobId) {
		let server = this.getServer(jobId)
		if (!server) return 
		this.map.delete(jobId)
		server.finish()
	}
	
	abort(jobId) {
		let server = this.getServer(jobId)
		if (!server) return 
		this.map.delete(jobId)
		// server abort
		server.abort(new Error('station aborted'))
	}
	
}

module.exports = new StoreFile(40)
