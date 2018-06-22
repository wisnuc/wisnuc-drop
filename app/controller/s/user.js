/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 14:19:12 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const debug = require('debug')('app:user')
const Joi = require('joi')

class UserController extends Controller {
  async show() {
    const { ctx, service } = this
    ctx.joiValidate({
      params: {
        id: Joi.number().required(),
      },
    })
    const userId = ctx.params.id
    const data = await service.user.show(userId)
    ctx.success(data)
  }
}

module.exports = UserController
