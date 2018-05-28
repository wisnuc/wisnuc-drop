/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authUser.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 18:05:23 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')

module.exports = () => {
  return async (ctx, next) => {
    const token = ctx.headers.authorization
    // decode
    try {
      const decoded = jwt.decode(token)
      if (!decoded)
        return ctx.error(new Error('decode failed'), 401, false)

      // expire
      if (!decoded.exp || decoded.exp <= Date.now())
        return ctx.error(new Error('token overdue, login again please！'), 401, false)

      if (!decoded.user)
        return ctx.error(new Error('authentication failed'), 401, false)

      let user = await ctx.service.user.show({ _id: decoded.user.id })
      if (!user) return ctx.error(new E.UserNotExist(), 401, false)

      ctx.auth = decoded
      debug(`checkUser: ${decoded}`)
      await next()

    } catch (error) {
      return ctx.error(new Error('authentication failed'), 401, false)
    }
  }
}
