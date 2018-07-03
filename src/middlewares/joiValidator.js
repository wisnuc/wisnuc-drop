/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   joiValidator.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 15:18:36 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/03 14:01:07 by Jianjin Wu       ###   ########.fr       */
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
    console.log(12123123123, error.details)
    if (error) {
      const details = error.details || []
      const failures = {}
      for (const detail of details) {
        failures[detail.path.join('.')] = detail.message
        // failures.push({
        //   filed: detail.path.join('.'),
        //   message: detail.message,
        // });
      }
      debug(`failures: ${failures}`)
      // throw new Error(JSON.stringify(failures));
      return res.error(failures, 400)
    }
    return next()
    // return Joi.validate(toValidate, schema, options, (err) => {
    //   if (err) {
    //     let details = err && err.details || []
    //     let failures = []
    //     for (let detail of details) {
    //       failures.push(detail.message)
    //     }
    //     debug(`failures: ${failures}`)
    //     return res.error(failures, 400)
    //   }
    //   return next()
    // })
  }
}
