/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqttService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/05 15:26:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/12 17:01:10 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('mqtt')
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

class MqttService {
  /**
   * send message to station
   * @param {string} stationId
   * @param {object} manifest
   */
  async pipe(stationId, manifest) {
    let WANIP = await ip.WANIP()
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
}

module.exports = new MqttService()
