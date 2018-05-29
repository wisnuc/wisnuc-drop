/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authUser.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 11:25:50 by Jianjin Wu       ###   ########.fr       */
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
        return ctx.error(new Error('decode failed'), 401)

      // expire
      if (!decoded.exp || decoded.exp <= Date.now())
        return ctx.error(new Error('token overdue, login again please！'), 401)

      if (!decoded.user)
        return ctx.error(new Error('authentication failed'), 401)

      let user = await ctx.service.user.show({ _id: decoded.user.id })
      if (!user) return ctx.error(new E.UserNotExist(), 401)

      ctx.auth = decoded
      await next()

    } catch (error) {
      console.log(error)
      return ctx.error(new Error('authentication failed'), 401)
    }
  }
}
