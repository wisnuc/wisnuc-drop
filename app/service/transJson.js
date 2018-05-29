/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   transJson.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 17:41:19 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:json')
const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')
// const mqttService = require('./mqttService')

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
    this.req.on('close', () => this.abort())
  }

  async run() {
    let stationId = this.req.params.id || this.req.params.stationId
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
 * @class TransJsonService
 * @extends Service
 */
class TransJsonService extends Service {

  constructor() {
    super()
    this.limit = 1024
    this.map = new Map()
    // global handle map
    setInterval(() => {
      if (this.map.size === 0) return
      this.schedule()
    }, 30000)
  }
	/**
	 * queue schedule
	 * @memberof TransJsonService
	 */
  schedule() {
    this.map.forEach((v, k) => {
      if (v.finished()) this.map.delete(k)
    })
  }

  request(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.TransformJsonQueueNoServer(), 403, false)
    // timeout
    if (server.isTimeOut()) {
      let e = new E.PipeResponseTimeout()
      this.close(jobId)
      return res.error(e)
    }
    else if (server.finished()) {
      let e = new E.PipeResponseHaveFinished()
      this.close(jobId)
      return res.error(e)
    }

    // client response
    let responseError = req.body.error
    if (responseError) {
      server.error(responseError.message, responseError.code)
    }
    else {
      // backwards compatible
      let data = (Object.keys(req.body).length === 1 && req.body.data) ? req.body.data : req.body
      server.success(data)
    }
    res.end()
  }

  createServer(req, res) {
    this.schedule()
    debug('transform size: ', this.map.size)
    if (this.map.size > this.limit)
      throw new new E.PipeTooMuchTask()
    let server = new Server(req, res)
    this.map.set(server.jobId, server)
    return server
  }
	/**
	 * close life cycle of the instance
	 * @param {any} jobId
	 * @memberof TransJsonService
	 */
  close(jobId) {
    let server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = TransJsonService
