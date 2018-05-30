/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fetchFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/18 16:43:25 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/30 18:12:15 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:fetch')
const uuid = require('uuid')
const EventEmiiter = require('events').EventEmitter

const mixin = require('../lib/mixin')
const threadify = require('../lib/threadify')

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
 */
class FetchFileService extends threadify(Service) {

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

module.exports = FetchFileService
