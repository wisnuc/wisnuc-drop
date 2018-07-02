/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authStation.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/02 14:06:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')
const stationService = require('../services/stationService')

module.exports = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization
      if (!token) return res.error(new Error('token not found'), 401)
      // decode
      const decoded = jwt.decode(token)
      if (!decoded) return res.error(new Error('decode failed'), 401)
      // no expire
      if (!decoded.station) return res.error(new Error('authentication failed'), 401)
      const station = await stationService
      .find({ _id: decoded.station.id })
      if (!station) return res.error(new E.StationNotExist(), 401)
      req.auth = decoded
      next()
    } catch (error) {
      return res.error(new Error('authentication failed'), 401)
    }
  }
}
