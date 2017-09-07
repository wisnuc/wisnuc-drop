/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   transformJson.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/05 15:23:03 by JianJin Wu       ###   ########.fr       */
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
	
		constructor() {
			super()
			this.jobId = uuid.v4()
			// 3s 与 buffers 相同生命周期, 等待 get res strem 的接入
			this.timer = Date.now() + 3000 
		}
		
		async run(req, res) {
			let stationId = req.params.id
			let user = req.auth.user
			// handle error
			this.defineSetOnce('error', () => res.error(this.error))
			// client response end
			this.defineSetOnce('resEnded', () => res.end())
			this.res = res
			let method, resource, body
			if (req.method === 'GET') body = req.query
			if (req.method === 'POST') body = req.body
			method = body.method
			resource = body.resource
			delete body.method
			delete body.resource
			// 封装 manifest
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
		/**
		 * websocket notice
		 * @param {any} stationId 
		 * @param {any} manifest 
		 * @memberof Server
		 */
		async notice(stationId, manifest) {
			// await socketIOHandler.pipe(stationId, manifest)
		}
		/**
		 * set timeOut function
		 * @param {any} timer 
		 * @memberof Server
		 */
		setTime(timer) {
			setTimeout(() => {
				this.error = new Error('response timeout')
			}, timer)	
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
	 * transform json
	 * @class StoreFile
	 * @extends {threadify(EventEmitter)}
	 */
	class transformJson extends threadify(EventEmitter) {
		
		constructor() {
			super()
			this.limit = 1024 // limit 
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
			if (!server) return res.error('queue no server')
			// timeout, notice both side to res.end
			if (server.isTimeOut()) {
				let e = new Error('station: GET request timeout')
				server.abort(e)
				return res.error(e)
			}
			// response 
			let responseError = req.body.error
			if (responseError) {
				server.res.error(responseError.message, responseError.code)
			}
			else {
				server.res.error(req.body)
			}
			res.end()
			this.finish(jobId)
			
			req.on('close', () => {
				this.abort(jobId)
			})
		}
		/**
		 * queue schedule
		 * @memberof transformJson
		 */
		schedule() {
			
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
		/**
		 * remove server from transform queue
		 * @param {any} jobId 
		 * @memberof transformJson
		 */
		removeServer(jobId) {
			let server = this.getServer(jobId)
			if (!server) return 
			this.map.delete(jobId)
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
	
	module.exports = new transformJson()
