/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqttService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/05 15:26:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/06 15:47:03 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('mqtt')
const config = require('getconfig')

const ip = require('../utils/ip')
const mqttClient = require('../lib/mqtt')
const stationService = require('./stationService')

class MqttService {
  /**
   * message
   * @param {*} topic
   * @param {*} message
   * @param {*} packet
   */
  message(topic, message, packet) {
    // message is Buffer
    debug(`message`, topic, message.toString(), packet)

    let { stationId } = JSON.parse(message)
    debug(stationId)
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
    // client.end()
  }
  /**
   * send message to station
   * @param {string} stationId
   * @param {object} manifest
   */
  pipe(stationId, manifest) {
    let message = Object.assign({}, manifest,
      {
        type: 'pipe',
        serverAddr: ip.WANIP + ':' + config.port
      }
    )
    debug('pipe:', data)
    let data = JSON.stringify(message)
    mqttClient.publish(`station/${stationId}/pipe`, data, { qos: 1 })
  }
}

module.exports = new MqttService()
