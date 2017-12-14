/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/14 14:05:54 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


/**
 * According to different server, init data:
 * 1. if no server information, create server info.
 */

 const ip = require('./ip')
const { Server, WisnucDB } = require('../models')
const logger = global.Logger(__filename)


/**
* if no server information, create server info.
*/
let register = () => {
	return new Promise(async (resolve, reject) => {
		try {
			let LANIP = ip.LANIP()
			let WANIP = await ip.WANIP()
		
			return Server.findOrCreate({
				where: {
					$or: [
						{ LANIP: LANIP },
						{ WANIP: WANIP }
					]
				},
				defaults: {
					LANIP: LANIP,
					WANIP: WANIP
				}
			}).spread(function (newObj, created) {
				if (created) return newObj
				return newObj.save()
			})
		}
		catch (err) {
			reject(err)
		}
		
	})
}


module.exports = { register }
