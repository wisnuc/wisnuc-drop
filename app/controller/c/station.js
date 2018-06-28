/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:36:12 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/27 15:44:53 by Jianjin Wu       ###   ########.fr       */
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
      const server = service.storeFile.createServer(ctx)
      const data = await server.run()
      console.log(123123, data)
      ctx.success(data)
    //   const data = await new Promise((resolve, reject) => {
    //     // create server
    //     // waiting response of station
    //     // response
    //     const server = service.storeFile.createServer(ctx)
    //     // response
    //     const timer = setTimeout(async () => {
    //       await server.run()
    //       console.log(22222222)
    //       // resolve({name: 'xxxxxx'})
    //       // rejected(new Error('xxxxx'))
    //     }, 2000)
    //     // clear timeout
    //     // clearTimeout(timer)
    //   })
    //   ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
  async fetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = StationController
