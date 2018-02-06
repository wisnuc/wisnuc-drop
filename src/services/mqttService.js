// /* ************************************************************************** */
// /*                                                                            */
// /*                                                        :::      ::::::::   */
// /*   mqttService.js                                     :+:      :+:    :+:   */
// /*                                                    +:+ +:+         +:+     */
// /*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
// /*                                                +#+#+#+#+#+   +#+           */
// /*   Created: 2017/12/05 15:26:17 by JianJin Wu        #+#    #+#             */
// /*   Updated: 2017/12/15 15:40:42 by JianJin Wu       ###   ########.fr       */
// /*                                                                            */
// /* ************************************************************************** */

const debug = require('debug')('app:mqtt')
const config = require('getconfig')

const ip = require('../utils/ip')
const client = require('../lib/mqtt')
const stationService = require('./stationService')

// message
client.on('message', (topic, message, packet) => {
  // message is Buffer
  debug(`message`, topic, message.toString(), packet)
  try {
    let { stationId } = JSON.parse(message)
    switch (topic) {
    case 'station/connect':
      debug('station: connect')
      stationService.updateOnline(stationId, true)
      break
    case 'station/disconnect':
      debug('station: disconnect')
      stationService.updateOnline(stationId, false)
      break
    }
  }
  catch (err) {
    throw err
  }
})


/**
 * This is mqtt service.
 * @class MqttService
 */
class MqttService {
  /**
   * send message to station
   * @param {string} stationId
   * @param {object} manifest
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
    let WANIP = global.server.WANIP
    let message = Object.assign({}, manifest,
      {
        type: 'pipe',
        serverAddr: WANIP + ':' + config.port
      }
    )
    debug('pipe:', message)
    let data = JSON.stringify(message)
    client.publish(`station/${stationId}/pipe`, data, { qos: 1 })
  }
  /**
   * send message to client
   * @param {any} userId 
   * @memberof MqttService
   */
  notice(userId) {
    let data = {
      userId: 123123
    }
    client.publish(`user/${userId}/notice`, data, { qos: 1 })
  }
}

module.exports = new MqttService()
