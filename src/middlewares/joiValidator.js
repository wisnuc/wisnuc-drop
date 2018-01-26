/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   joiValidator.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 15:18:36 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/26 11:43:04 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:joi')
const Joi = require('joi')

module.exports = (schema, options) => {

  options = options || {
    abortEarly: false
  }

  return (req, res, next) => {
    let toValidate = {}
    if (!schema) {
      return next()
    }
    // params body query
    ['params', 'body', 'query'].forEach(function (key) {
      if (schema[key]) {
        toValidate[key] = req[key]
      }
    })

    return Joi.validate(toValidate, schema, options, (err) => {
      if (err) {
        let details = err && err.details || []
        let failures = []
        for (let detail of details) {
          failures.push(detail.message)
        }
        debug(`failures: ${failures}`)
        return res.error(failures, 400)
      }
      return next()
    })
  }
}
