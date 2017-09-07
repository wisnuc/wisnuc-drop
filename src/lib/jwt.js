/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/12 15:27:49 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('jwt-simple')

const SECRET = 'WISNUC_DROP' // TODO:


/**
 * JWT (JSON Web Token)
 * @class
 */
class Jwt {
	/**
	 * 加密
	 * @param {object} payload 
	 * @returns {object} token
	 * @memberof Jwt
	 */
	encode(payload) {
		// exp: default 30d
		payload.exp = Date.now() + 1000 * 3600 * 24 * 30
		return jwt.encode(payload, SECRET)
	}
	/**
	 * 解密
	 * @param {object} token 
	 * @returns {object} decoded data
	 * @memberof Jwt
	 */
	decode(token) {
		return jwt.decode(token, SECRET)
	}
}


module.exports = new Jwt()
