/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fetchFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/18 16:43:25 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/07 14:22:55 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:fetch')
const uuid = require('uuid')
const EventEmiiter = require('events').EventEmitter

const threadify = require('../lib/threadify')
const mqttService = require('./mqttService')

/**
 * Fetch file.
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
 * @class Server
 * @extends {threadify(EventEmiiter)}
 */
class Server extends threadify(EventEmiiter) {

  constructor(req, res) {
    super()
    this.req = req
    this.res = res
    this.timer = Date.now() + 15 * 1000
    this.jobId = uuid.v4()
    // req error
    this.req.on('error', err => this.error(err))
    // req abort 
    this.req.on('close', () => this.abort())
  }

  async run() {
    let stationId = this.req.params.id || this.req.params.stationId
    let user = this.req.auth.user

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
    catch (err) {
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
    await mqttService.pipe(stationId, manifest)
  }

  isTimeOut() {
    if (Date.now() > this.timer) {
      let e = new E.PipeResponseTimeout()
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

  abort() {
    this.res.finished = true
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
    // global handle map
    setInterval(() => {
      if (this.map.size === 0) return
      this.schedule()
    }, 30000)
  }

  // schedule
  schedule() {
    this.map.forEach((v, k) => {
      if (v.finished()) this.map.delete(k)
    })
  }

  request(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.FetchFileQueueNoServer(), 403, false)
    // timeout
    if (server.isTimeOut()) {
      let e = new E.PipeResponseTimeout()
      // end
      this.close(jobId)
      return res.error(e)
    }
    if (server.finished()) {
      let e = new E.PipeResponseHaveFinished()
      this.close(jobId)
      return res.error(e)
    }
    // pipe
    req.pipe(server.res)
    // error
    req.on('error', err => {
      // response
      res.error(err)
      server.error(err)
    })
  }

  createServer(req, res) {
    this.schedule()
    debug('fetch size: ', this.map.size)
    if (this.map.size > this.limit)
      throw new E.PipeTooMuchTask()
    let server = new Server(req, res)
    this.map.set(server.jobId, server)
    return server
  }
	/**
	 * response fetch error to client
	 * @param {any} req 
	 * @param {any} res 
	 * @memberof FetchFile
	 */
  response(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.FetchFileQueueNoServer(), 403, false)
    // finished
    if (server.finished()) return res.end()
    
    // backwards compatible
    let responseError = req.body.error || req.body
    let { message, code } = responseError
    server.error(message, code)
    res.end()
    // end
    this.close(jobId)
  }
	/**
	 * close life cycle of the instance
	 * @param {any} jobId 
	 * @param {any} err
	 * @memberof FetchFile
	 */
  close(jobId) {
    let server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = new FetchFile(10000)
