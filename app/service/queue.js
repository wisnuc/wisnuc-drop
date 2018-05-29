/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   queue.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 18:00:03 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:queue')
const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')
// const mqttService = require('./mqttService')

/**
 * upload/download file queue.
 * @class QueueService
 * @extends Service
 */
class QueueService extends Service {

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

  // schedule
  schedule() {
    this.map.forEach((v, k) => {
      if (v.finished()) this.map.delete(k)
    })
  }

  request(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.StoreFileQueueNoServer(), 403, false)
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
    debug('store size: ', this.map.size)
    if (this.map.size > this.limit)
      throw new E.PipeTooMuchTask()
    let server = new Server(req, res)
    this.map.set(server.jobId, server)
    return server
  }
	/**
	 * response store error to client
	 * @param {any} req
	 * @param {any} res
	 * @memberof StoreFileService
	 */
  response(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.StoreFileQueueNoServer(), 403, false)
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
	 * @memberof StoreFileService
	 */
  close(jobId) {
    let server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = QueueService
