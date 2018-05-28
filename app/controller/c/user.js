/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 15:58:25 by Jianjin Wu       ###   ########.fr       */
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
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const userId = ctx.params.id
      const user = await service.user.show(userId)
      if (!user) return ctx.error(new Error('user not found'), 404)
      ctx.success(user)
    } catch (err) {
      ctx.error(err)
    }
  }
  // TODO: move station
  async findStations() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const userId = ctx.params.id
      const stations = await service.user.findStations(userId)
      if (!stations) return ctx.error(new Error('station not found'), 404)
      ctx.success(stations)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findInteresting() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        userId: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const userId = ctx.params.userId
      const users = await service.user.findInteresting(userId)
      if (!users) return ctx.error(new Error('user not found'), 404)
      ctx.success(users)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findInterestingSources() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          userId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          personId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const personId = ctx.params.personId
      const data = await service.user.findInterestingSources(personId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = UserController
