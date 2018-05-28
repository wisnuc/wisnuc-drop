/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:36:12 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 15:58:50 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')

class StationController extends Controller {
  async index() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        params: {
          id: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
        },
      })
      const userId = ctx.params.id
      const stations = await service.user.findStations(userId)
      if (!stations) return ctx.error(new Error('station not found'), 404)
      ctx.success(stations)
    } catch (err) {
      ctx.error(err)
    }
  }
  async show() {}
  async findUsers() {}
  async storeFile() {}
  async fetchFile() {}
  async getJson() {}
  async postJson() {}
}

module.exports = StationController
