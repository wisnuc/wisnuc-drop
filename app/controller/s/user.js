/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/23 17:05:48 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const debug = require('debug')('app:user')
const Joi = require('joi')

class UserController extends Controller {
  async index() {
    const { ctx, service } = this
    ctx.joiValidate({
      params: {
        id: Joi.number().required(),
      },
    })
    const data = await service.user.index()
    ctx.success(data)
  }
}

module.exports = UserController
