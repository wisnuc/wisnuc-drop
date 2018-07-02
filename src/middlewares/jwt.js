/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   jwt.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/18 16:01:04 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/02 11:32:27 by Jianjin Wu       ###   ########.fr       */
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
        return res.error(new Error('decode failed'), 401)

      // expire
      // if (!decoded.exp || decoded.exp <= Date.now())
      //   return res.error(new Error('token overdue, login again please！'), 401)

      if (!decoded.user)
        return res.error(new Error('authentication failed'), 401)

      let user = await User.find({
        where: {
          id: decoded.user.id
        },
        raw: true
      })
      if (!user) return res.error(new E.UserNotExist(), 401)

      req.auth = decoded
      next()

    } catch (error) {
      return res.error(new Error('authentication failed'), 401)
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
        return res.error(new Error('decode failed'), 401)

      // no expire
      if (!decoded.station)
        return res.error(new Error('authentication failed'), 401)

      let station = await Station.find({
        where: {
          id: decoded.station.id
        },
        raw: true
      })
      if (!station) return res.error(new E.StationNotExist(), 401)

      req.auth = decoded
      next()

    } catch (error) {
      return res.error(new Error('authentication failed'), 401)
    }
  }
}
