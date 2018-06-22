/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 17:49:37 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 15:36:19 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class TicketController extends Controller {
  async index() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        query: {
          creator: Joi.string().guid({ version: [ 'uuidv4' ] }),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }),
          // status: Joi.number().valid([ 0, 1 ]),
        },
      })
      const creator = ctx.query.creator
      const stationId = ctx.query.stationId
      const conditions = {}
      if (creator) {
        conditions.creator = creator
      }
      if (stationId) {
        conditions.creator = creator
      }
      const data = await service.ticket.index(conditions)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async show() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const userId = ctx.auth.user.id
      const data = await service.ticket.findByClient(ticketId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async inviteUser() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const userId = ctx.auth.user.id
      const data = await service.ticket.inviteUser(ticketId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async shareBox() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const boxId = ctx.params.boxId
      const userId = ctx.auth.user.id
      const data = await service.ticket.shareBox(ticketId, boxId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findAllUser() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const data = await service.ticket.findAllUser(ticketId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async createUser() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const userId = ctx.auth.user.id
      const data = await service.ticket.createUser(ticketId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findUser() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          userId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const ticketId = ctx.params.id
      const userId = ctx.auth.user.id
      const data = await service.ticket.findUser(ticketId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = TicketController
