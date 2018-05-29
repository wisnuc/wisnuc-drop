/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authStation.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 11:26:18 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')

module.exports = () => {
  return async (ctx, next) => {
    try {
      const token = ctx.request.header.authorization
      if (!token)
        return ctx.error(new Error('token not found'), 401)
       // decode
      const decoded = jwt.decode(token)
      if (!decoded)
        return ctx.error(new Error('decode failed'), 401, false)

      // no expire
      if (!decoded.station)
        return ctx.error(new Error('authentication failed'), 401, false)

      let station = await await ctx.service.station.show({ _id: decoded.station.id })
      if (!station) return ctx.error(new E.StationNotExist(), 401, false)

      ctx.auth = decoded
      await next()

    } catch (error) {
      return ctx.error(new Error('authentication failed'), 401, false)
    }
  // /**
	//  * station authorization
	//  * @param {any} ctx
	//  * @param {any} next
	//  */
  // const checkDoubleArrow = async (ctx, next) => {
  //   let userId = req.auth.user.id
  //   let stationId = req.params.id
  //   try {
  //     let flag = await stationService.clientCheckStation(userId, stationId)
  //     if (!flag) ctx.error(new Error('check double arrow failed'), 401, false)
  //     await next()
  //   }
  //   catch(err) {
  //     return ctx.error(err, 401, false)
  //   }
  // }

  }
}
