/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:37:15 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 14:07:01 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class BoxController extends Controller {
  async index() {
    const { ctx, service } = this
    try {
      const userId = ctx.auth.user.id
      const data = await service.box.index(userId)
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
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.show(boxId)
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
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findUser(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findShareTicket() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findShareTicket(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async storeFile() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findShareTicket(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async fetchFile() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findShareTicket(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async getJson() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findShareTicket(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async postJson() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          stationId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.findShareTicket(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = BoxController
