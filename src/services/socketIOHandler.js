/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socketIOHandler.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/10 10:57:29 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/23 11:14:18 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ursa = require('ursa')
const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter
const config = require('getconfig')

const jwt = require('../lib/jwt')
const { 
	Station, 
	Server,
	StationServer, 
	WisnucDB 
} = require('../models')
// get local ip
const ip = require('../utils/ip')
const LANIP = ip.LANIP()
// socket map
const socketIOMap = new Map()

/**
 * socket.io handler
 * @class SocketIOHandler
 * @extends {EventEmitter}
 */
class SocketIOHandler extends EventEmitter {
	
	constructor() {
		super()
	}
	/**
 	 * 接受请求登录, 返回一串随机数
 	 * @param {object} socket
	 * @param {object} data
	 * @memberof SocketIOHandler	 
 	 */
	async requestLogin(socket, data) {
		let station = await Station.find({ where: { id: data.id } })
		if (!station) throw new E.StationNotExist()
		let crt = ursa.createPublicKey(station.publicKey)
		// random number
		let seed = uuid.v4()
		let encryptData = crt.encrypt(seed, 'utf8', 'base64')

		// save in session
		socket.handshake.session.seed = seed
		socket.handshake.session.stationId = data.id
		let message = {
			type: 'checkLogin',
			data: { encryptData: encryptData }
		}
		socket.emit('message', message)
	}

	/**
 	 * 校验随机数, 若匹配则将有关信息填入database, 否则return error
 	 * @param {object} socket
	 * @param {object} data
	 * @memberof SocketIOHandler	 
 	 */
	login(socket, data) {
	
		let seed = socket.handshake.session.seed
		let stationId = socket.handshake.session.stationId
		if (data && data.seed == seed) {

			// 存入 map, return token
			socketIOMap.set(stationId, socket)

			// update station information, and return token
			return WisnucDB.transaction(async t => {
				let data = await Promise.props({
					station: Station.find({
						where: { id: stationId },
						transaction: t,
						raw: true
					}),
					server: Server.find({
						where: { LANIP: LANIP },
						transaction: t,
						raw: true
					})
				})

				let { station, server } = data
				if (!station) throw new E.StationNotExist()
				if (!server) throw new E.ServerNotExist()
				
				// create station and server relationship
				await StationServer.findOrCreate({
					where: {
						serverId: server.id,
						stationId: stationId
					}
				}).spread(function (newObj, created) {
					// created === true
					if (created) return newObj
					newObj.isOnline = 1 // update 
					return newObj.save()
				})
				
				let token = {
					station: {
						id: station.id,
						name: station.name
					}
				}
				let message = {
					type: 'login',
					data: {
						success: true,
						token: jwt.encode(token)
					}
				}
				socket.emit('message', message)
			})

		} else {
			this.error(socket, 'login validate error')
		}
	}

	/**
	 * send messaget to station (json or file)
	 * @param {string} stationId 
	 * @param {object} manifest 
	 * @memberof SocketIOHandler
	 */
	async pipe(stationId, manifest) {
		
		let socket = this.getSocket(stationId)
		if (!socket) throw new Error('have no socket, try connect again!')
		
		// find server with station
		let station = await StationServer.find({
			where: { 
				stationId: stationId , 
				isOnline: 1
			},
			attributes: ['serverId'],
			raw: true
		})
		if (!station) throw new E.StationNotOnline()
			
		let server = await Server.find({
			where: { id: station.serverId },
			attributes: ['WANIP'],
			raw: true
		})
		if (!server) throw new E.ServerNotExist()
		
		let message = Object.assign({}, manifest, 
			{
				type: 'pipe', 
				serverAddr: server.WANIP + ':' + config.port
			}
		)
		socket.emit('message', message)
	}
	
	/**
	 * return socketIO of map
	 * @param {any} stationId 
	 * @memberof SocketIOHandler
	 */
	getSocket(stationId) {
		return socketIOMap.get(stationId)
	}
	
	/**
	 * 
	 * @param {any} socket 
	 * @param {any} data 
	 * @memberof SocketIOHandler
	 */
	async disconnect(socket) {
		// socketMap delete
		socketIOMap.delete(socket)
		// 更新 station 为离线状态
		let stationId = socket.handshake.session.stationId
		await StationServer.update({isOnline: 0}, {where: {stationId: stationId}})
	}
	
	/**
	 * 
	 * @param {any} socket 
	 * @param {any} error 
	 * @memberof SocketIOHandler
	 */
	error(socket, error) {
		socket.error(error.message) // return message
	}
}

module.exports = new SocketIOHandler()
