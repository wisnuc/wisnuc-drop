/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/01 15:13:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/08 18:39:18 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('mqtt')
const mqtt = require('mqtt')
const config = require('getconfig')

const MQTT_URL = `mqtt://${config.mqtt.host}:${config.mqtt.port}`
const mqttService = require('../services/mqttService')

const settings = {
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  clean: false, 
  // will: {
  //   topic: `${stationId}/diconnect`,
  //   payload: 'I am offline',
  //   qos: 1,
  //   retain: false
  // },
  // username: 'demo',
  // password: 'demo'
}
const client = mqtt.connect(MQTT_URL, settings)

// subcribe topic
client.subscribe(`station/connect`, {qos:1})
client.subscribe(`station/disconnect`, {qos:1})

// connect
client.on('connect', connack =>  debug('cloud connect successfully!', connack))

// message
// client.on('message', (topic, message, packet) =>  debug(`message`, topic, message.toString(), packet))

// reconnect
client.on('reconnect', err => {
  debug('reconnect', err)
})

// close
client.on('close', () => {
  debug('close')
})

module.exports = client