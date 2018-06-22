/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/24 10:37:15 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 16:14:16 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class TweetController extends Controller {
  async create() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        body: {
          uuid: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
          type: Joi.string().required(),
          index: Joi.number().required(),
          boxId: Joi.string().required(),
          tweeter: Joi.string().required(),
          ctime: Joi.number().required(),
          parent: Joi.number(),
          list: Joi.array(),
          comment: Joi.string().empty(''),
        },
      })
      const stationId = ctx.auth.station.id
      const tweet = Object.assign({}, ctx.request.body, { stationId })
      const data = await service.ticket.create(tweet)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = TweetController
