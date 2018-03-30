/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * FIXME: replace jwt.js
 * add function:
 * 1. cloud check station online status, when clients request cloud api.
 * 2. station ckeck double arrow.
 * 
 */

const debug = require('debug')('app:auth')
const jwt = require('../lib/jwt')
const { User, Station } = require('../models')
const stationService = require('../services/stationService')

module.exports = {
  /**
	 * global user authorization
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
  async checkUser(req, res, next) {
    const token = req.headers.authorization
    // decode
    try {
      const decoded = jwt.decode(token)
      if (!decoded)
        return res.error(new Error('decode failed'), 401, false)

      // expire
      if (!decoded.exp || decoded.exp <= Date.now())
        return res.error(new Error('token overdue, login again please！'), 401, false)

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
      debug(`checkUser: ${decoded}`)
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
  async checkStation(req, res, next) {
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
  },
  /**
	 * station authorization
	 * @param {any} req 
	 * @param {any} res 
	 * @param {any} next 
	 */
  async checkDoubleArrow(req, res, next) {
    let userId = req.auth.user.id
    let stationId = req.params.id
    try {
      let flag = await stationService.clientCheckStation(userId, stationId)
      if (!flag) res.error(new Error('check double arrow failed'), 401, false)
      next()
    }
    catch(err) {
      return res.error(err, 401, false)
    }
  }
}
