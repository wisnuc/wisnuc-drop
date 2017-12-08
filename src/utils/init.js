/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/08 15:08:56 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ip = require('./ip')
const { Server, WisnucDB } = require('../models')
const logger = global.Logger(__filename)

/**
 * According to different server, init data:
 * 1. if no server information, create server info.
 */


/**
* if no server information, create server info.
*/
let register = () => {
	return new Promise(async (resolve, reject) => {
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
	})
}


module.exports = { register }
