/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:36:12 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 17:27:17 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class StationController extends Controller {
  async show() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const stationId = ctx.params.id
      const data = await service.station.show(stationId)
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
  async storeFile() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const server = await service.storeFile.createServer(ctx)
      await server.run()
    } catch (err) {
      ctx.error(err)
    }
  }
  async fetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = StationController
