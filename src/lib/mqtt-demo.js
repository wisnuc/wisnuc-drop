/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt-demo.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/05 15:26:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/05 16:28:32 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('mqtt:cloud')
const config = require('getconfig')

const mqtt = require('./mqtt')
const ip = require('../utils/ip')
const stationId = 'station_123123'

var obj = {
  name: `wujianjin`,
  age: 27
}

var data = JSON.stringify(obj)
mqtt.publish(`station/${stationId}/pipe`, data, {qos: 1})

/**
 * send message to station
 * @param {string} stationId 
 * @param {object} manifest 
 * @memberof SocketIOHandler
 */
function pipe(stationId, manifest) {
  let message = Object.assign({}, manifest, 
    {
      type: 'pipe', 
      serverAddr: ip.WANIP + ':' + config.port
    }
  )
  let data = JSON.stringify(message)
  mqtt.publish(`station/${stationId}/pipe`, data, {qos: 1})
}