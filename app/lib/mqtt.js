/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/04 17:18:07 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/31 14:33:49 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const assert = require('assert')
const mqtt = require('mqtt')

module.exports = app => {
  app.addSingleton('mqtt', createOneClient)
}

function createOneClient(config, app) {
  const { config, logger } = app
  const url = config.mqtt.url
  assert(url, '[mqtt] url is required on config')

  const settings = {
    clientId: 'cloud_' + Math.random().toString(16).substr(2, 8),
    clean: true,
    keepalive: 3,
    reconnectPeriod: 5 * 1000,
    connectTimeout: 10 * 1000,
  }
  const client = mqtt.connect(config.mqtt.url, settings)

  // subcribe topic
  client.subscribe('$queue/station/connect', { qos: 1 })
  client.subscribe('$queue/station/disconnect', { qos: 1 })
  // connect
  client.on('connect', () => {
    logger.info(`[mqtt] ${config.mqtt.url} connect successfully!`)
  })
  // message
  // client.on('message', (topic, message, packet) =>  debug(`message`, topic, message.toString(), packet))
  // reconnect
  client.on('reconnect', () => {
    logger.error(`[mqtt] ${config.mqtt.url} reconnect`)
  })
  // close
  client.on('close', () => {
    logger.error(`[mqtt] ${config.mqtt.url} close`)
  })
  // offline
  client.on('offline', () => {
    logger.error(`[mqtt] ${config.mqtt.url} offline`)
  })
  return client
}

