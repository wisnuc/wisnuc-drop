/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/24 18:03:55 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class UserController extends Controller {
  async show() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().required(),
        },
      })
      const userId = ctx.params.id
      const data = await service.user.show(userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async create() {
    const { ctx, service } = this
    try {
      // await ctx.joiValidate({
      //   params: {
      //     id: Joi.string().required(),
      //   },
      // })
      const user = {
        _id: 'e7126d69-3c94-489b-8b34-edf5a6d4f384',
        unionId: 'oOMKGwg-r5PFkIt54ZXP4M51ZxNU',
        status: 1,
        stations: [ '4303984e-6f32-422b-8eda-11a050a1dd37' ],
      }
      const data = await service.user.create(user)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findStations() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().required(),
        },
      })
      const userId = ctx.params.id
      const data = await service.user.findStations(userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findInteresting() {}
  async findInterestingSources() {}
}

module.exports = UserController
