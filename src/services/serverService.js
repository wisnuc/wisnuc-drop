/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serverService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/25 14:53:53 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/30 17:35:21 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const _ = require('lodash')
const { Server, ServerStation, Station, Box, BoxServer, WisnucDB } = require('../models')

/**
 * This is server service.
 * @class ServerService
 */
class ServerService {
	/**
	 * create new server
	 * @param {object} server 
	 * @returns 
	 * @memberof ServerService
	 */
	create(server) {
		return Server.create(server)
	}
	/**
	 * get server information
	 * @param {string} serverId 
	 * @returns {object} server 
	 */
	async find(serverId) {
		let server = await Server.find({
			where: {
				id: serverId
			},
			include: {
				model: ServerStation,
				as: 'stations',
				where: {
					serverId: serverId,
					status: 1
				},
				attributes: ['stationId']
				// attributes: [ [Sequelize.col('stationId'), 'id'] ]
			}
		})
		return server
		// return Server.scope('stations')
		// .find({
		// 	where: {
		// 		id: serverId
		// 	}
		// })
	}
	/**
	 * update server
	 * @param {any} server 
	 * @memberof ServerService
	 */
	update(server) {
		return Server.update(server, {
			where: {
				id: server.id
			}
		})
	}
	/**
	 * delete server
	 * @param {any} serverId 
	 * @memberof ServerService
	 */
	delete(serverId) {
		return Server.update({status: -1}, {
			where: {
				id: serverId
			}
		})
	}
	/**
	 * get stations
	 * @param {string} serverId 
	 * @returns {array} stations 
	 */
	findAllStation(serverId) { 
		const sql = [
			'SELECT s.id, s.name',
			'FROM stations AS s',
			'JOIN server_station AS us',
			'ON us.serverId = "' + serverId + '"',
			'AND s.id = us.stationId'
		].join(' ')
		return  WisnucDB.query(sql, {nest: true})
	}
	/**
	 * get friends TODO:
	 * 1. servers in the boxes owned by me.
	 * 2. servers created boxes, and I was in the boxes. 
	 * @param {any} serverId 
	 * @memberof ServerService
	 */
	findAllFriend(serverId) {
		return Promise.props({
			ownerIds: BoxServer.findAll({
				include: {
					model: Box,
					where: {
						ownerId: serverId
					}
				},
				attributes: ['serverId']
			}),
			serverIds: Box.findAll({
				include: {
					model: BoxServer,
					as: 'servers',
					where: {
						serverId: serverId
					}
				},
				attributes: ['ownerId']
			})
		})
	}
}

module.exports = new ServerService()
