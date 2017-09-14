/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketIO.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/09 16:42:35 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/15 10:40:51 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('socketIO')
const socketIOHandler = require('../services/socketIOHandler')

// message while list
const whiteList = ['requestLogin', 'login']

/**
 * @param {string} type
 * @returns {boolean} 
 */
let checkWhiteList = type => {
	return whiteList.indexOf(type) < 0 ? false : true
}

/**
 * cloud 与 station 通信
 * @module socketIO
 */
module.exports = io => {
	io.on('connection', client => {
		console.log('process.pid:', process.pid)
		debug(`~~~ client ${client.id}: connent successfully ~~~`)
		/**
 		* 接受 nas 发过来的消息, 根据 type 类型选择 socketHandler
		 * @param {object} message 
		 {
			 type: 'xxxx',
			 data: {}
		 }
 		*/
		client.on('message', async message => {
			let { type, data } = message
			// check while list
			if (checkWhiteList(type)) {
				try {
					await socketIOHandler[type](client, data)
				}
				catch(err) {
					debug(`message ${type} happen error`, err)
					// seed error to station
					socketIOHandler.error(client, err)
				}
			}
		})
		// disconnect event
		client.on('disconnect', () => {
			debug(`client ${client.id}: disconnect`)
			socketIOHandler.disconnect(client)
		})
		
		// TODO: consider if need to listen error event
		client.on('error', error => {
			debug(`client ${client.id}: error`, error)
			socketIOHandler.error(client, error)
		})
	})
}
