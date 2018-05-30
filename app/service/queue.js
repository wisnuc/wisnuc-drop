/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   queue.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/30 17:46:29 by Jianjin Wu       ###   ########.fr       */
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

  constructor(ctx) {
    super(ctx)
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

  get(jobId) {
    let server = this.map.get(jobId)
    if (!server) throw new Error('server not found')
  }

  set(server) {
    this.schedule()
    debug('store size: ', this.map.size)
    if (this.map.size > this.limit) throw new Error(' have too much server')
    this.map.set(server.jobId, server)
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
