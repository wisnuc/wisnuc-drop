/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   res.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:57:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/25 15:43:48 by Jianjin Wu       ###   ########.fr       */
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
  * @param {number} status - default 200
  */
  res.success = (data, status) => {
    status = status || DEFAULT_SUCCESS_STATUS
    return res.status(status).json({
      url: req.originalUrl,
      code: 1,
      message: 'ok',
      data: data || null
    })
  }
  /**
	* error response
  * @param {any} error 
  * @param {number} status - default 403
  */
  res.error = (error, status) => {
    let code, message
    status = status || DEFAULT_ERROR_STATUS
    if (error) {
      if (error instanceof Error) {
        code = error.code || status
        message = error.message
      }
      // 400
      else if (error instanceof Array) {
        code = 400
        message = httpCode[status]
      }
      // others
      else {
        code = error.code || status || 403
        message = error.message || httpCode[status] || 'forbidden'
      }
      // error log
      logger.error({
        method: req.method,
        url: req.originalUrl,
        message: message,
        stack: error.stack
      })
    }
    let response = {
      url: req.originalUrl,
      code: code,
      message: message
    }
    debug(`error: ${error}`)
    // show stack in production environment
    if (getconfig['env'] === 'production') fundebug.notifyError(error)
    return res.status(status).json(response)
  }
  next()
}
