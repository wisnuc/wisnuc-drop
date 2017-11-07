/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/06 14:59:50 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ip = require('./ip')
const { Server, StationServer, WisnucDB } = require('../models')
const logger = global.Logger(__filename)

/**
 * According to different server, init data:
 * 1. clear the relationship of between station and server.
 * 2. if no server information, create server info.
 */

 /**
 *  clear the relationship of between station and server.
 */
function cleanStation() {
	return WisnucDB.transaction(async t => {
		let LANIP = ip.LANIP()
		let WANIP = await ip.WANIP()
		let serverInfo = await Server.find({
			where: {
				LANIP: LANIP,
				WANIP: WANIP
			},
			transaction: t,
			attributes: ['id'],
			raw: true
		})
		if (!serverInfo) return
		await StationServer.destroy({
			where: {
				serverId: serverInfo.id
			},transaction: t
		})
	})
}

/**
* if no server information, create server info.
*/
function register() {
	return WisnucDB.transaction(async t => {
		let LANIP = ip.LANIP()
		let WANIP = await ip.WANIP()
		let serverInfo = await Server.find({
			where: {
				$or: [
					{ LANIP: LANIP },
					{ WANIP: WANIP }
				]
			},
			transaction: t,
			raw: true
		})
		if (serverInfo) return
		await Server.create({
			LANIP: LANIP,
			WANIP: WANIP
		}, { transaction: t })
	})
}

module.exports = {
	start() {
		return cleanStation()
		.then(() => {
			return register()
		})
		.catch(err => {
			logger.error(err.name + ': ' + err.message)
		})
	}
}
