// /* ************************************************************************** */
// /*                                                                            */
// /*                                                        :::      ::::::::   */
// /*   mqttService.js                                     :+:      :+:    :+:   */
// /*                                                    +:+ +:+         +:+     */
// /*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
// /*                                                +#+#+#+#+#+   +#+           */
// /*   Created: 2017/12/05 15:26:17 by Jianjin Wu        #+#    #+#             */
// /*   Updated: 2017/12/15 15:40:42 by Jianjin Wu       ###   ########.fr       */
// /*                                                                            */
// /* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:mqtt')
const Promise = require('bluebird')

const client = require('../lib/mqtt')

/**
 * This is mqtt service.
 * @class MqttService
 */
class MqttService extends Service {
  /**
   * send message to station
   * @param {String} stationId - station uuid
   * @param {Object} manifest - formdata info
   * @return {Promise} Promise
   */
  async pipe(stationId, manifest) {
    // {
    //   method: 'GET',
    //   resource: 'L3VzZXJz',
    //   body: {},
    //   sessionId: '62bacb4d-d746-4859-86ba-1a80508fd61d',
    //   user: {
    //     id: 'b20ea9c9-c9a6-4a4f-adde-c8f7c1c11884',
    //     nickName: 'L',
    //     unionId: undefined
    //   },
    //   type: 'pipe',
    //   serverAddr: '10.10.9.87:4000'
    // }
    return new Promise((resolve, reject) => {
      const WANIP = global.server.WANIP
      const message = Object.assign({}, manifest, {
        type: 'pipe',
        serverAddr: WANIP + ': 4000', // config.port
      })
      debug('pipe:', stationId, message)
      const data = JSON.stringify(message)
      this.ctx.mqtt.publish(`station/${stationId}/pipe`, data, { qos: 1 }, err => {
        debug(`publish_err: ${err}`)
        if (err) {
          return reject(new Error('publish message error'))
        }
        resolve()
      })
    })
  }
  /**
   * send message to client
   * @param {Array} userIds - user uuid array
   * @param {Array} data - message
   * @memberof MqttService
   */
  notice(userIds, data) {
    userIds = Array.isArray(userIds) ? userIds : [ userIds ]
    data = Array.isArray(data) ? data : [ data ]
    const message = JSON.stringify(data)
    for (const userId of userIds) {
      debug(userId, message)
      // seed message to client
      this.ctx.mqtt.publish(`client/user/${userId}/box`, message, { qos: 1 })
    }
  }
}

module.exports = MqttService
