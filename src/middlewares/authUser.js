/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   authUser.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/02/10 16:36:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/02 13:59:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')
const userService = require('../services/userService')

module.exports = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization
      if (!token) return res.error(new Error('token not found'), 401)
      // decode
      const decoded = jwt.decode(token)
      if (!decoded) return res.error(new Error('decode failed'), 401)
      // expire FIXME: 
      // if (!decoded.exp || decoded.exp <= Date.now()) {
      //   return res.error(new Error('token overdue, login again please！'), 401)
      // }
      if (!decoded.user) return res.error(new Error('authentication failed'), 401)
      const user = await userService
        .find({ _id: decoded.user.id })
      if (!user) return res.error(new E.UserNotExist(), 401)
      req.auth = decoded
      next()
    } catch (error) {
      return res.error(new Error('authentication failed'), 401)
    }
  }
}
