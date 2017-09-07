/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serverInfo.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/09 17:46:02 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/10 17:57:37 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const EventEmitter = require('events').EventEmitter
const os = require('os')
const config = require('getconfig')

// TODO: 获取 WANIP LANIP 
const LANIP = os.networkInterfaces().enp2s0[0].address
const WANIP = config.server[LANIP]

/**
 * This is server infomation.
 * @class
 * @extends {EventEmitter}
 */
class ServerInfo extends EventEmitter {
	
	/**
	 * Creates an instance of ServerInfo.
	 * @constructor 
	 * @param {string} WANIP - wan ip
	 * @param {string} LANIP - lan ip
	 */
	constructor(WANIP, LANIP) {
		super()
		this.WANIP = WANIP
		this.LANIP = LANIP
		this.map = new Map() // (stationId, socket)
	}
	
	add(stationId, socket) {
		this.map.set(stationId, socket)
	}
	
	offline(stationId) {
		this.map.delete(stationId)
	}
	
	abort() { }
	
	error() { }
}

module.exports = new ServerInfo(WANIP, LANIP)

