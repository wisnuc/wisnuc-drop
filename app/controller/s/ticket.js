/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 17:49:37 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 15:47:44 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class TicketController extends Controller {
  async create() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        body: {
          type: Joi.string().valid([ 'invite', 'bind', 'share' ]).required(),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          creator: Joi.string(),
          data: Joi.string(),
        },
      })
      const ticket = ctx.request.body
      const data = await service.ticket.create(ticket)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async index() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          creator: Joi.string().guid({ version: [ 'uuidv4' ] }),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }),
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
      const stationId = ctx.auth.station.id
      const data = await service.ticket.findByStation(ticketId, stationId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async update() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
        body: {
          status: Joi.number().valid([ -1, 1 ]).required(), // -1: deleted, 1: finished
          // userId: Joi.string().guid({ version: [ 'uuidv4' ] }),
        },
      })
      const conditions = {
        _id: ctx.params.id,
        stationId: ctx.auth.station.id,
        status: ctx.request.body.status,
      }
      const data = await service.ticket.update(conditions)
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
  async updateUserStatus() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          ids: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
        body: {
          type: Joi.string().valid([ 'rejected', 'resolved' ]).required(),
        },
      })
      const ticketIds = ctx.params.ids
      const type = ctx.request.body.type
      const data = await service.ticket.updateUserStatus(ticketIds, type)
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
      const userId = ctx.params.userId
      const data = await service.ticket.findUser(ticketId, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async updateUser() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          userId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
        body: {
          type: Joi.string().valid([ 'rejected', 'resolved' ]).required(),
        },
      })
      const ticketId = ctx.params.id
      const userId = ctx.params.userId
      const type = ctx.request.body.type
      const data = await service.ticket.updateUser(ticketId, type, userId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = TicketController
