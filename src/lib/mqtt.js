/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/01 15:13:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/21 15:18:00 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('mqtt')
const mqtt = require('mqtt')
const crypto = require('crypto')
const config = require('getconfig')

// qcloud api config
const {appid, secretId, secretKey} = config.qcloud
const srcStr = `Appid=${appid}&Instanceid=mqtt-5p50b9y7s&Action=Connect`

const hmac = crypto.createHmac('sha256', secretKey)
const password = hmac.update(srcStr).digest('base64')

const MQTT_URL = `mqtt://${config.mqtt.host}:${config.mqtt.port}`

const settings = {
  clientId: 'mqtt-5p50b9y7s@cloud_' + Math.random().toString(16).substr(2, 8),
  clean: true,
  keepalive: 3,
  reconnectPeriod: 5 * 1000,
  connectTimeout: 10 * 1000,
  username: secretId,
  password: password
}
const client = mqtt.connect(MQTT_URL, settings)

// subcribe topic
client.subscribe(`station/connect`, { qos: 1 })
client.subscribe(`station/disconnect`, { qos: 1 })

// connect
client.on('connect', connack => debug('cloud connect successfully!', connack))

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

// offline
client.on('offline', () => {
  debug('offline')
})

module.exports = client
