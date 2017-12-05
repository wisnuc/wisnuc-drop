/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mqtt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/01 15:13:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/05 18:08:28 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('mqtt:cloud')
const mqtt = require('mqtt')
const uuid = require('uuid')

const cloudId = uuid.v4()
const clientId = `cloud_123`

const settings = {
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  clean: false, 
  // will: {
  //   topic: `${stationId}/diconnect`,
  //   payload: 'I am offline',
  //   qos: 1,
  //   retain: false
  // }
}
// const client = mqtt.connect('mqtt://122.152.206.50:1883', settings)
const client = mqtt.connect('mqtt://localhost:1883', settings)
 

// station client disconnect
// client.subscribe(diconnectUrl, {qos:1}, (err) => {
//   debug(err)
// })
client.subscribe(`station/connect`, {qos:1})
client.subscribe(`station/disconnect`, {qos:1})

client.on('connect', function (connack) {
  
  debug('cloud connect successfully!', connack);
  
})

client.on('message', function (topic, message, packet) {
  // message is Buffer
  debug(123123, topic, message.toString(), packet)

  switch (topic) {
    case 'station/connect':
      debug(33333)
      break;
    case 'station/disconnect':
      debug(12312321)
      break;
  
    default:
      break;
  }
  // client.end()
})

module.exports = client