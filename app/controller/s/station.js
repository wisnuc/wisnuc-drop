/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:37:15 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/30 15:45:28 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class BoxController extends Controller {
  async create() {}
  async index() {}
  async update() {}
  async destory() {}
  async getToken() {}
  async findUsers() {}
  async resStoreFile() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const server = ctx.service.queue.get(jobId)
      await server.response(ctx)
    } catch (err) {
      ctx.error(err)
    }
  }
  async resStoreFileResult() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: ['uuidv4'] }).required(),
          jobId: Joi.string().guid({ version: ['uuidv4'] }).required(),
        },
        body: {
          error: Joi.any(),
          data: Joi.any(),
        },
      })
      const server = ctx.service.queue.get(jobId)
      await server.reportResult(ctx)
    } catch (err) {
      ctx.error(err)
    }
  }
  async resFetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = BoxController
