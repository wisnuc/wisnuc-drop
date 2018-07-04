/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   joiValidator.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 15:18:36 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/04 13:51:20 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:joi')
const Joi = require('joi')

module.exports = (schema, options) => {

  options = options || { abortEarly: true }

  return (req, res, next) => {
    let toValidate = {}
    if (!schema) return next()
    const arr = [ 'params', 'body', 'query' ]
    // params body query
    arr.forEach(function (key) {
      if (schema[key]) {
        toValidate[key] = req[key]
      }
    })
    const { error } = Joi.validate(toValidate, schema, options)
    if (error) {
      const details = error.details || []
      const failures = {}
      for (const detail of details) {
        failures[detail.path.join('.')] = detail.message
      }
      return res.error(failures, 400)
    }
    return next()
  }
}
