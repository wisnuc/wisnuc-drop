/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fetchFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/03 16:22:39 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/04 16:48:31 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')
const EventEmiiter = require('events').EventEmitter

const threadify = require('../lib/threadify')
const socketIOHandler = require('./socketIOHandler')

/**
 * fetch file
 * @module FetchFile 
 */

/**
 * 
 * @class Server
 * @extends {threadify(EventEmiiter)}
 */
class Server extends threadify(EventEmiiter) {

	constructor() {
		super()
		this.jobId = uuid.v4()
		this.timer = Date.now() + 3000
	}

	async run(req, res) {
		let stationId = req.params.id
		let user = req.auth.user
		this.defineSetOnce('error', () => res.error(this.error))
		this.defineSetOnce('formEnded', () => {
			res.end()
		})
		this.res = res
		// abort 
		req.on('close', () => {
			this.abort()
		})
		let manifest = Object.assign({}, 
			{
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
		this.formEnded = true
	}

	abort(err) { 
		this.error = err || new Error('client aborted')
	}
}

/**
 * @class FetchFile
 * @extends {threadify(EventEmiiter)}
 */
class FetchFile extends threadify(EventEmiiter) {

	constructor(limit) {
		super()
		this.map = new Map()
		this.limit = limit || 40
	}

	request(req, res) {
		let jobId = req.params.jobId
		let server = this.map.get(jobId)
		if (!server) return res.error('queue no server')
		// timeout, notice both side to res.end
		if (server.isTimeOut()) {
			let e = new Error('station: POST request timeout')
			server.abort(e)
			return res.error(e)
		}
		req.pipe(server.res)
		req.on('error', () => this.abort(jobId))
		req.on('end', () => res.end())
	}
	
	createServer() {
		if (this.map.size > this.limit)
			throw new Error('正在处理的任务过多,请稍后再试')
		let server = new Server()
		this.map.set(server.jobId, server)
		return server
	}

	/**
	 * handle finish
	 * @param {any} jobId 
	 * @memberof FetchFile
	 */
	finish(jobId) { 
		let server = this.map.has(jobId)
		if (!server) return 
		this.map.delete(jobId)
	}
	
	/**
	 * handle error
	 * @param {any} err 
	 * @param {any} jobId 
	 * @memberof FetchFile
	 */
	error(err, jobId) { 
		this.abort(jobId)
		throw err
	}
	
	/**
	 * handle abort
	 * @param {any} jobId 
	 * @memberof FetchFile
	 */
	abort(jobId) {
		let server = this.map.has(jobId)
		if (!server) return 
		this.map.delete(jobId)
		// server abort
		server.abort(new Error('station aborted'))
	}
}


module.exports = new FetchFile(40)
