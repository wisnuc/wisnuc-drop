/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 16:23:34 by Jianjin Wu       ###   ########.fr       */
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
      const data = await service.user.show(userId)
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
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const userId = ctx.params.id
      const data = await service.user.findStations(userId)
      ctx.success(data)
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
      const data = await service.user.findInteresting(userId)
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
