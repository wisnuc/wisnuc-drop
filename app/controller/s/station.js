/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:37:15 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 13:20:47 by Jianjin Wu       ###   ########.fr       */
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
          name: Joi.string().max(12).truncate(),
          LANIP: Joi.string(),
          publicKey: Joi.string().required(),
        },
      })
      const station = ctx.request.body
      const data = await service.station.create(station)
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
      const stationId = ctx.params.stationId
      const data = await service.station.show(stationId)
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
          name: Joi.string().max(12).truncate(),
          LANIP: Joi.string(),
          userIds: Joi.array().items(Joi.string().guid({ version: [ 'uuidv4' ] })),
        },
      })
      const stationId = ctx.params.id
      const body = ctx.request.body
      // update station
      if (body.name || body.LANIP) {
        const station = Object.assign({}, {
          id: stationId,
          name: body.name,
          LANIP: body.LANIP,
        })
        await service.station.update(station)
      }
      // update users
      if (body.userIds && body.userIds.length !== 0) {
        await service.station.updateUsers(stationId, body.userIds)
      }
      ctx.success()
    } catch (err) {
      ctx.error(err)
    }
  }
  async destory() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const stationId = ctx.params.stationId
      const data = await service.station.destory(stationId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async getToken() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const stationId = ctx.params.id
      const data = await service.station.getToken(stationId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async findUsers() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const stationId = ctx.params.id
      const data = await service.station.findUsers(stationId)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async resStoreFile() {
    const { ctx, service } = this
    try {
      // await ctx.joiValidate({
      //   params: {
      //     id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
      //     jobId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
      //   },
      // })
      console.log(12312322)
      // const server = service.queue.get(jobId)
      await service.storeFile.request(ctx)
    } catch (err) {
      ctx.error(err)
    }
  }
  async resStoreFileResult() {
    const { ctx, service } = this
    try {
      // await ctx.joiValidate({
      //   params: {
      //     id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
      //     jobId: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
      //   },
      //   body: {
      //     error: Joi.any(),
      //     data: Joi.any(),
      //   },
      // })
      await service.storeFile.reportResult(ctx)
    } catch (err) {
      console.log('resStoreFileResult', err)
      ctx.error(err)
    }
  }
  async resFetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = BoxController
