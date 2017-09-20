/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   transformJson.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/20 10:15:53 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')
const socketIOHandler = require('./socketIOHandler')

/**
 * transform json - server 
 * @class Server 
 * @extends {EventEmitter}
 */
class Server extends threadify(EventEmitter) {

	constructor(req, res) {
		super()
		this.req = req
		this.res = res
		this.finished = false
		this.timer = Date.now() + 3000
		this.jobId = uuid.v4()
	}

	async run() {
		let stationId = this.req.params.id
		let user = this.req.auth.user
		// abort 
		this.req.on('close', () => new Error('client aborted'))
		
		let method, resource, body
		if (this.req.method === 'GET') body = this.req.query
		if (this.req.method === 'POST') body = this.req.body
		method = body.method
		resource = body.resource
		delete body.method
		delete body.resource
		// encapsulation manifest
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
		catch (err) {
			this.error(err)
		}
	}
	/**
	 * websocket notice
	 * @param {any} stationId 
	 * @param {any} manifest 
	 * @memberof Server
	 */
	async notice(stationId, manifest) {
		await socketIOHandler.pipe(stationId, manifest)
	}
	
	isTimeOut() {
		return Date.now() > this.timer ? true : false
	}

	finish(data) {
		if (this.finished) return 
		this.finished = true
		data = data || 'transform json successfully!'
		this.res.success(data)
	}

	error(err, code) {
		if (this.finished) return 
		this.finished = true
		this.res.error(err, code)
	}
}


/**
 * @class TransformJson
 * @extends {threadify(EventEmitter)}
 */
class TransformJson extends threadify(EventEmitter) {

	constructor(limit) {
		super()
		this.limit = limit || 1024
		this.map = new Map()
	}
	/**
	 * queue schedule
	 * @memberof TransformJson 
	 */
	schedule() {} 
	/**
	 * find server
	 * @param {any} jobId 
	 * @param {any} res 
	 * @returns 
	 * @memberof TransformJson
	 */
	request(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('transformJson queue no server')
		
		// timeout
		if (server.isTimeOut()) {
			let e = new Error('station response timeout')
			server.abort(e)
			return res.error(e)
		}
		
		// response 
		let responseError = req.body.error
		if (responseError) {
			server.error(responseError.message, responseError.code)
		}
		else {
			server.finish(req.body)
		}
		res.end()
		this.finish(jobId)

		req.on('error', err => {
			res.end()
			this.error(jobId, err)
		})
		
		req.on('close', () => {
			res.end()
			this.error(new Error('station aborted'))
		})
	}

	createServer(req, res) {
		if (this.map.size > this.limit)
			throw new Error('正在处理的任务过多,请稍后再试')
		let server = new Server(req, res)
		this.map.set(server.jobId, server)
		return server
	}
	/**
	 * handle finish
	 * @param {any} jobId 
	 * @memberof TransformJson
	 */
	finish(jobId) { 
		this.close(jobId)
	}
	/**
	 * handle error
	 * @param {any} jobId 
	 * @memberof TransformJson
	 */
	error(jobId, err) { 
		this.close(jobId, err)
	}
	/**
	 * close life cycle of the instance
	 * @param {any} jobId 
	 * @param {any} err
	 * @memberof TransformJson
	 */
	close(jobId, err) {
		let server = this.map.get(jobId)
		if (!server) return 
		// server response
		err ? server.error(err) : server.finish()
		// delete map
		this.map.delete(jobId)
	}
}

module.exports = new TransformJson()
