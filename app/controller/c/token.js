/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 16:14:44 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 13:43:47 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class TokenController extends Controller {

  async oauth2() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        query: {
          code: Joi.string().required(),
          platform: Joi.string().valid([ 'web', 'mobile' ]).required(),
        },
      })
      const { code, platform } = ctx.query
      const data = await service.token.oauth2(platform, code)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }

  async mpToken() {
    const { ctx, service } = this
    try {
      await ctx.joiValidate({
        body: {
          code: Joi.string().required(),
          iv: Joi.string().required(),
          encryptedData: Joi.string().required(),
        },
      })
      const { code, iv, encryptedData } = ctx.body
      const data = await service.token.mpToken(code, iv, encryptedData)
      ctx.success(data)
    } catch (err) {
      ctx.error(err)
    }
  }
}

module.exports = TokenController
