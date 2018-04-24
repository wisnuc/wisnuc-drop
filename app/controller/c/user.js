/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/24 18:14:58 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const debug = require('debug')('app:user')
const Joi = require('joi')

class UserController extends Controller {
  async show() {
    const { ctx, service } = this
    debug('User猜猜猜')
    try {
      await ctx.joiValidate({
        params: {
          ids: Joi.number().required(),
        },
      })
      debug('validate end', ctx.params)
      const data = await service.user.index()
      ctx.success([])
    } catch (err) {
      ctx.error(err)
    }
    
  }
  async findStations() {
    const { ctx, service } = this
    debug('User猜猜猜')
    ctx.joiValidate({
      params: {
        id: Joi.number().required(),
      },
    })
    debug('validate end', this.ctx)
    const data = await service.user.index()
    ctx.success(data)
  }
  async findInteresting() {}
  async findInterestingSources() {}
}

module.exports = UserController
