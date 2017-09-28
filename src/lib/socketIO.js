/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketIO.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/15 10:02:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/26 14:54:40 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('socketIO')
const socketIOHandler = require('../services/socketIOHandler')

// message while list
const whiteList = ['requestLogin', 'login', 'error']

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
	io.on('connection', socket => {
		debug(`~~~ socket ${socket.id}: connent successfully ~~~`)
		/**
 		 * 接受 nas 发过来的消息, 根据 type 类型选择 socketHandler
		 * @param {object} message 
		  {
			  type: 'xxxx',
			  data: {}
		  }
 		*/
		socket.on('message', async message => {
			let { type, data } = message
			// check while list
			if (checkWhiteList(type)) {
				try {
					await socketIOHandler[type](socket, data)
				}
				catch(err) {
					debug(`message ${type} happen error`, err)
					// seed error to station
					socketIOHandler.error(socket, err)
				}
			}
		})
		// disconnect event
		socket.on('disconnect', () => {
			debug(`socket ${socket.id}: disconnect`)
			socketIOHandler.disconnect(socket)
		})
		
		// listen error event, disconnect this station
		socket.on('error', error => {
			debug(`socket ${socket.id}: error`, error)
			socketIOHandler.error(socket, error)
		})
	})
}
