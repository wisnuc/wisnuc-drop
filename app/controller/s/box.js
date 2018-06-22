/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:37:15 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 14:13:31 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class BoxController extends Controller {
  async create() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        body: {
          name: Joi.string().empty(''),
          uuid: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          owner: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          users: Joi.array().items(Joi.string().guid({ version: [ 'uuidv4' ] }).required()),
          ctime: Joi.number().required(),
          mtime: Joi.number().required(),
        },
      })
      const stationId = ctx.auth.station.id
      const options = Object.assign({}, ctx.request.body, { stationId })
      const data = await service.box.create(options)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async bulkCreate() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        body: {
          create: Joi.array().items(Joi.object({
            name: Joi.string().empty(''),
            uuid: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
            owner: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
            users: Joi.array().items(Joi.string().guid({ version: [ 'uuidv4' ] }).required()),
            ctime: Joi.number().required(),
            mtime: Joi.number().required(),
            tweet: Joi.object(),
          })),
        },
      })
      const stationId = ctx.auth.station.id
      const create = ctx.request.body
      const data = await service.box.bulkCreate(stationId, create)
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
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
        body: {
          name: Joi.string().empty(''),
          owner: Joi.string().guid({ version: [ 'uuidv4' ] }),
          users: Joi.array().items(Joi.string().guid({ version: [ 'uuidv4' ] }).required()),
          mtime: Joi.number().required(),
        },
      })
      const options = Object.assign({}, { uuid: ctx.params.boxId }, ctx.request.body)
      const data = await service.box.update(options)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async destory() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          boxId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const boxId = ctx.params.boxId
      const data = await service.box.destory(boxId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = BoxController
