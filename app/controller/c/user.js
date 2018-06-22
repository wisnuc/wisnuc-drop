/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/20 15:50:26 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class UserController extends Controller {
  async show() {
    const { ctx, service } = this
    const errors = ctx.validateJoi({
      params: {
        id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
      },
    })
    console.log(errors)
    if (errors) return ctx.error(errors, 400)
    const userId = ctx.params.id
    const data = await service.user.show(userId)
    ctx.success(data)
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
