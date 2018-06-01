/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:36:12 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/01 16:57:40 by Jianjin Wu       ###   ########.fr       */
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
      // create server
      const server = service.storeFile.createServer(ctx)
      await server.run()
      const data = await new Promise((resolve, reject) => {
        // response
        setTimeout(async () => {
          console.log(22222222)
          // resolve({name: 'xxxxxx'})
          // rejected(new Error('xxxxx'))
        }, 2000)
        // clear timeout
      })
       ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async fetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = StationController
