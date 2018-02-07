/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   res.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:57:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/07 14:36:46 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:res')
const { getconfig } = require('getconfig')
const fundebug = require('../utils/fundebug')
const logger = Logger('app:res')

const DEFAULT_SUCCESS_STATUS = 200
const DEFAULT_ERROR_STATUS = 403

//http code 
const httpCode = {
  200: 'ok',
  400: 'invalid parameters',
  401: 'Authentication failed',
  403: 'forbidden',
  404: 'not found',
  500: 'system error'
}

module.exports = (req, res, next) => {
  /**
  * success response
  * @param {any} data 
  * @param {number} status - default 500
  */
  res.success = (data, status) => {
    data = data || null
    status = status || DEFAULT_SUCCESS_STATUS
    return res.status(status).json({
      url: req.originalUrl,
      code: 1,
      message: 'ok',
      data: data
    })
  }
  /**
	* error response
  * @param {any} data 
  * @param {number} status - default 403
  */
  res.error = (err, status) => {
    let code = 'no code'
    let message = 'no message'
    let data = null
    let stack = null
    status = status || DEFAULT_ERROR_STATUS
    if (err) {
      if (err instanceof Error) {
        code = err.code || status
        message = err.message
        stack = err.stack
      }
      // 400
      if (err instanceof Array) {
        code = 400
        message = httpCode[status]
        data = err
      }
      // make a record in error.log when httpcode != 200
      if (status != 200) {
        logger.error({
          method: req.method,
          url: req.originalUrl,
          message: message,
          stack: stack
        })
      }
    }
    let response = {
      url: req.originalUrl,
      code: code,
      message: message,
      data: data
    }
    // show stack in production environment
    if (getconfig['env'] === 'production') {
      response.stack = stack
      fundebug.notifyError(err)
    }
    return res.status(status).json(response)
  }
  next()
}
