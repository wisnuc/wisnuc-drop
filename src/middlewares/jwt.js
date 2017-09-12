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
// TODO: 验证 user 是否 存在

const CLIENT_TOKEN = ''
const STATION_TOKEN = ''
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
				return res.error('authentication failed', 401)
			
			// expire
			if (!decoded.exp || decoded.exp <= Date.now())
				return res.error('token overdue, login again please！', 401)
			
			if (!decoded.user) 
				return res.error('authentication failed', 401)

			let user = await User.find({
				where: {
					id: decoded.user.id
				},
				raw: true
			})
			if (!user) return res.error('authentication failed', 401)
			
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
				return res.error('authentication failed', 401)
			
			// expire
			if (!decoded.exp || decoded.exp <= Date.now())
				return res.error('token overdue, login again please！', 401)
			
			if (!decoded.station) 
				return res.error('authentication failed', 401)
			
			let station = await Station.find({
				where: {
					id: decoded.user.id
				},
				raw: true
			})
			if (!station) return res.error('authentication failed', 401)

			req.auth = decoded
			next()
			
		} catch (error) {
			return res.error('authentication failed', 401)
		}
	},
	/**
	 * token example
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
	cAuthTest(req, res, next) {
		req.auth = {
			user:{
				id: '6e6c0c4a-967a-489a-82a2-c6eb6fe9d991',
				status: 1,
				password: null,
				email: null,
				phoneNO: null,
				unionId: 'oOMKGwjtQBp1bCEj88FMotdQCuMw',
				nickName: '刘华',
				avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBsJR1DhjgRbUKk9adPdl8TfmLj2roOlNQc0alnAySqD56HCeBd7PU5TNBxlfAqqX4ficialTRl9LA/0',
				refreshToken: null,
				accessToken: null,
				createdAt: '2017-07-26T02:40:51.000Z',
				updatedAt: '2017-07-26T02:40:51.000Z'
			},
			exp: 1503643276207
		}
		next()
	},
	/**
	 * token example
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
	sAuthTest(req, res, next) {
		req.auth = {
			station:
			{
				id: '6b421e49-95f5-4b70-8575-a2444b5337db',
				name: 'station_1504595036243'
			},
			exp: 1503643276207
		}
		next()
	}
}
