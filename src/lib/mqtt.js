/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/01 15:13:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/12 16:23:25 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('mqtt')
const mqtt = require('mqtt')
const config = require('getconfig')

const mqttService = require('../services/mqttService')

const MQTT_URL = `mqtt://${config.mqtt.host}:${config.mqtt.port}`
const settings = {
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  clean: true
}
const client = mqtt.connect(MQTT_URL, settings)

// subcribe topic
client.subscribe(`$queue/station/connect`, {qos:1})
client.subscribe(`$queue/station/disconnect`, {qos:1})

// connect
client.on('connect', connack =>  debug('cloud connect successfully!', connack))

// message
// client.on('message', (topic, message, packet) =>  debug(`message`, topic, message.toString(), packet))

// reconnect FIXME:
client.on('reconnect', err => {
  debug('reconnect', err)
})

// close
client.on('close', () => {
  debug('close')
})

module.exports = client