/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   joiValidate.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 16:35:18 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/18 17:20:28 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Joi = require('joi')
const debug = require('debug')('app:joiValidate')

module.exports = options => {

  return async (ctx, next) => {
    options = options || {
      abortEarly: false,
    }
    ctx.joiValidate = schema => {
      let toValidate = {}
      if (!schema) {
        return next()
      }
      // params body query
      [ 'params', 'body', 'query' ].forEach(key => {
        if (schema[key]) {
          toValidate[key] = ctx[key]
          debug(ctx[key])
        }
      })

      // const { error, value } = Joi.validate(toValidate, schema, options)
      // if (error) {
      //   ctx.error(error, 400)
      // }
      debug(123123, schema, toValidate)
      return Joi.validate(toValidate, schema, async err => {
        if (err) {
          const details = err && err.details || []
          const failures = []
          for (const detail of details) {
            failures.push(detail.message)
          }
          return ctx.error(failures, 400)
        }
        // await next()
      })
    }
    await next()
  }

}
