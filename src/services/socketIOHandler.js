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

const jwt = require('../lib/jwt')
const { 
	Station, 
	Server,
	StationServer, 
	WisnucDB 
} = require('../models')
// const serverInfo = require('../lib/serverInfo')
// FIXME: get LANIP
// const os = require('os')
// const LANIP = os.networkInterfaces().enp2s0[0].address
const LANIP = '10.10.9.59'

const config = require('getconfig')
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
 	 * @param {object} client
	 * @param {object} data
	 * @memberof SocketIOHandler	 
 	 */
	async requestLogin(client, data) {
		let station = await Station.find({ where: { id: data.id } })
		if (!station) throw new Error('no station')
		let crt = ursa.createPublicKey(station.publicKey)
		// random number
		let seed = uuid.v4()
		let encryptData = crt.encrypt(seed, 'utf8', 'base64')

		// TODO: 存入内存中
		client.handshake.session.seed = seed
		client.handshake.session.stationId = data.id
		let message = {
			type: 'checkLogin',
			data: { encryptData: encryptData }
		}
		client.emit('message', message)
	}

	/**
 	 * 校验随机数, 若匹配则将有关信息填入database, 否则return error
 	 * @param {object} client
	 * @param {object} data
	 * @memberof SocketIOHandler	 
 	 */
	login(client, data) {
	
		let seed = client.handshake.session.seed
		let stationId = client.handshake.session.stationId
		if (data && data.seed == seed) {
			// 存入 map, 返回 token
			socketIOMap.set(stationId, client)
			// update station information, and return token
			WisnucDB.transaction(async t => {
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
				if (!station) throw new Error('no station')
				if (!server) throw new Error('no server')
				
				
				// create station and server relationship
				let stationServer = await StationServer.find({
					where: { stationId: stationId },
					transaction: t
				})
				if (!stationServer) {
					await StationServer.create({
						isOnline: 1,
						stationId: stationId,
						serverId: server.id
					}, {transaction: t})
				}
				else {
					await StationServer.update({
						isOnline: 1,
						serverId: server.id
					}, {
						where: { stationId: stationId },
						transaction: t
					})
				}
				
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
				client.emit('message', message)
			})

		} else {
			this.error(client, 'login validate error')
		}
	}

	/**
	 * send messaget to station (json or file)
	 * @param {string} stationId 
	 * @param {object} manifest 
	 * @memberof SocketIOHandler
	 */
	async pipe(stationId, manifest) {
		
		let client = this.getSocket(stationId)
		if (!client) throw new Error('have no socket, try connect again!')
		
		// find server with station
		let station = await StationServer.find({
			where: { stationId: stationId , isOnline: 1 },
			attributes: ['serverId'],
			raw: true
		})
		if (!station) throw new Error('this station is offline')
			
		let server = await Server.find({
			where: { id: station.serverId },
			attributes: ['WANIP'],
			raw: true
		})
		if (!server) 	throw new Error('this station haven`t server')
		
		let message = Object.assign({}, manifest, 
			{
				type: 'pipe', 
				serverAddr: server.WANIP + ':' + config.port
			}
		)
		client.emit('message', message)
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
	 * @param {any} client 
	 * @param {any} data 
	 * @memberof SocketIOHandler
	 */
	async disconnect(client) {
		// socketMap delete
		socketIOMap.delete(client)
		// 更新 station 为离线状态
		let stationId = client.handshake.session.stationId
		await StationServer.update({isOnline: 0}, {where: {stationId: stationId}})
	}
	
	/**
	 * 
	 * @param {any} client 
	 * @param {any} error 
	 * @memberof SocketIOHandler
	 */
	error(client, error) {
		client.error(error.message) // return message
	}
}

module.exports = new SocketIOHandler()
