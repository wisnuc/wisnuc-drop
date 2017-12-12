/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/03 17:45:20 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/07/24 16:54:35 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')
const { User, Station } = require('../models')

module.exports = {
	/**
	 * client authorization
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
	async cAuth(req, res, next) {
		const token = req.headers.authorization
		// decode
		try {
			const decoded = jwt.decode(token)
			if (!decoded)
				return res.error('decode failed', 401)
			
			// expire FIXME:
			// if (!decoded.exp || decoded.exp <= Date.now())
			// 	return res.error('token overdue, login again please！', 401)
			
			if (!decoded.user) 
				return res.error('authentication failed', 401)
			let user = await User.find({
				where: {
					id: decoded.user.id
				},
				raw: true
			})
			if (!user) return res.error('have no user', 401)
			
			req.auth = decoded
			next()

		} catch (error) {
			return res.error('authentication failed', 401)
		}
	},
	/**
	 * station authorization
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
	async sAuth(req, res, next) {
		const token = req.headers.authorization
		// decode
		try {
			const decoded = jwt.decode(token)
			if (!decoded)
				return res.error('decode failed', 401)
			
			// no expire
			if (!decoded.station) 
				return res.error('authentication failed', 401)
			let station = await Station.find({
				where: {
					id: decoded.station.id
				},
				raw: true
			})
			if (!station) return res.error('have no station', 401)

			req.auth = decoded
			next()
			
		} catch (error) {
			return res.error('authentication failed', 401)
		}
	}
}
