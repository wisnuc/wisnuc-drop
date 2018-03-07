/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/18 16:01:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/07 13:57:18 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:jwt')
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
        return res.error(new Error('decode failed'), 401, false)

      // expire
      // if (!decoded.exp || decoded.exp <= Date.now())
      //   return res.error(new Error('token overdue, login again please！'), 401)

      if (!decoded.user)
        return res.error(new Error('authentication failed'), 401, false)

      let user = await User.find({
        where: {
          id: decoded.user.id
        },
        raw: true
      })
      if (!user) return res.error(new E.UserNotExist(), 401, false)

      req.auth = decoded
      next()

    } catch (error) {
      return res.error(new Error('authentication failed'), 401, false)
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
        return res.error(new Error('decode failed'), 401, false)

      // no expire
      if (!decoded.station)
        return res.error(new Error('authentication failed'), 401, false)

      let station = await Station.find({
        where: {
          id: decoded.station.id
        },
        raw: true
      })
      if (!station) return res.error(new E.StationNotExist(), 401, false)

      req.auth = decoded
      next()

    } catch (error) {
      return res.error(new Error('authentication failed'), 401, false)
    }
  }
}
