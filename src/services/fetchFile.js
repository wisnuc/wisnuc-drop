/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fetchFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/18 16:43:25 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/20 10:15:47 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')
const EventEmiiter = require('events').EventEmitter

const threadify = require('../lib/threadify')
const socketIOHandler = require('./socketIOHandler')

/**
 * fetch file.
 * 在 client 从 station 下载文件中起到桥接作用
 * Notifications:
 * 未开始下载：
 *   1. client aborted request. 
 *   2. websocket connect failed.
 *   3. client request timeout.
 * 开始下载：
 *   1. response overtime.
 *   2. client aborted request.
 *   3. station response error. 
 * 下载完毕：
 *   1. client res.end().
 *   2. station res.end().
 *   3. delete worker in map.
 * @module FetchFile 
 */

/**
 * Fetch file.
 * @class Server
 * @extends {threadify(EventEmiiter)}
 */
class Server extends threadify(EventEmiiter) {

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
		this.req.on('close', () => this.error(new Error('client aborted')))
		
		let method, resource, body
		if (this.req.method === 'GET') body = this.req.query
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
		catch(err) {
			this.error(err)
		}
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
	
	isTimeOut() {
		return Date.now() > this.timer ? true : false
	}
	
	finish() { 
		if (this.finished) return 
		this.finished = true
		this.close()
	}

	error(err) {
		if (this.finished) return
		this.finished = true
		this.close(err)
	}
	
	close(err) {
		return err ? this.res.error(err) : this.res.success('fetch file successfully!')
	}
}

/**
 * @class FetchFile
 * @extends {threadify(EventEmiiter)}
 */
class FetchFile extends threadify(EventEmiiter) {

	constructor(limit) {
		super()
		this.limit = limit || 1024 
		this.map = new Map()
	}

	// TODO: schedule
	
	request(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('fetchFile queue no server')

		// timeout
		if (server.isTimeOut()) {
			let e = new Error('station response timeout')
			server.abort(e)
			return res.error(e)
		}
		
		// pipe
		req.pipe(server.res)
		this.finish(jobId)
		
		req.on('error', err => {
			res.end()
			this.error(jobId, err)
		})
		
		req.on('close', () => {
			res.end()
			this.error(new Error('station aborted'))
		})
		// server.req
		// server.req.on('close', () => {
		// 	res.end()
		// 	this.error(new Error('client aborted'))
		// })
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
	 * @memberof FetchFile
	 */
	finish(jobId) { 
		this.close(jobId)
	}
	/**
	 * handle error
	 * @param {any} jobId 
	 * @param {any} err 
	 * @memberof FetchFile
	 */
	error(jobId, err) { 
		this.close(jobId, err)
	}
	/**
	 * close life cycle of the instance
	 * @param {any} jobId 
	 * @param {any} err
	 * @memberof FetchFile
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

module.exports = new FetchFile()
