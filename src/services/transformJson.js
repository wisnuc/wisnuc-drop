/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   transformJson.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/29 18:06:27 by JianJin Wu       ###   ########.fr       */
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
		this.timer = Date.now() + 15 * 1000
		this.jobId = uuid.v4()
		// req error
		this.req.on('error', err => this.error(err))
		// abort 
		this.req.on('close', () => this.error(new Error('client aborted')))
	}

	async run() {
		let stationId = this.req.params.id
		let user = this.req.auth.user

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
 * @class TransformJson
 * @extends {threadify(EventEmitter)}
 */
class TransformJson extends threadify(EventEmitter) {

	constructor(limit) {
		super()
		this.limit = limit || 1024
		this.map = new Map()
		// global handle map
		setInterval(() => {
			if (this.map.size === 0)return 
			this.schedule() 
		}, 30000)
	}
	/**
	 * queue schedule
	 * @memberof TransformJson 
	 */
	schedule() {
		this.map.forEach((v, k) => {
			if(v.finished()) this.map.delete(k)
		})
	}

	request(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('transformJson queue no server')
		// timeout
		if (server.isTimeOut() || server.finished()) {
			let e = new Error('response time more than 15s')
			res.error(e)
		}
		else {
			// client response 
			let responseError = req.body.error
			if (responseError) {
				server.error(responseError.message, responseError.code)
			}
			else {
				server.success(req.body)
			}
			res.end()
		}
		// end
		this.close(jobId)
		// req error
		req.on('error', err => console.error('req error: ', err))
	}

	createServer(req, res) {
		this.schedule()
		console.warn('transform size: ', this.map.size);
		if (this.map.size > this.limit)
			throw new Error('too many tasks being processed, please try again later!')
		let server = new Server(req, res)
		this.map.set(server.jobId, server)
		return server
	}
	/**
	 * close life cycle of the instance
	 * @param {any} jobId 
	 * @memberof TransformJson
	 */
	close(jobId) {
		let server = this.map.get(jobId)
		if (!server) return
		// delete map
		this.map.delete(jobId)
	}
}

module.exports = new TransformJson(10000)
