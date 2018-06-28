/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   queue.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/04 14:48:16 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/28 16:52:30 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:queue')

const map = new Map()
/**
 * upload/download file queue.
 * @class QueueService
 * @extends Service
 */

class QueueService extends Service {
  constructor(ctx) {
    super(ctx)
    this.limit = 1024
    this.map = map
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
    const server = this.map.get(jobId)
    if (!server) throw new Error('server not found')
    return server
  }

  set(jobId, server) {
    this.schedule()
    debug('store size: ', this.map.size)
    if (this.map.size > this.limit) throw new Error(' have too much server')
    this.map.set(jobId, server)
  }
  /**
	 * close life cycle of the instance
	 * @param {String} jobId - job uuid
	 * @memberof StoreFileService
	 */
  close(jobId) {
    const server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = QueueService
