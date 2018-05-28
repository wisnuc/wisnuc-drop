/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   joiValidate.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 16:35:18 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 16:31:05 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Joi = require('joi')
const debug = require('debug')('app:joiValidate')

module.exports = options => {

  return async (ctx, next) => {
    options = options || {
      abortEarly: false,
    }
    ctx.joiValidate = async schema => {
      const toValidate = {}
      if (!schema) {
        return next()
      }
      // params body query
      [ 'params', 'body', 'query' ].forEach(key => {
        if (schema[key]) {
          toValidate[key] = ctx[key]
          // debug(ctx)
        }
      })
      // const { error, value } = Joi.validate(toValidate, schema, options)
      // if (error) {
      //   ctx.error(error, 400)
      // }
      Joi.validate(toValidate, schema, err => {
        if (err) {
          const details = err && err.details || []
          const failures = []
          for (const detail of details) {
            failures.push(detail.message)
          }
          debug('err:', failures)
          const error = new Error(failures)
          error.code = 400
          throw error
        }
      })
    }
    await next()
  }
}
