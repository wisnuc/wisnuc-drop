/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   res.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:57:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/12 15:54:36 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { getconfig } = require('getconfig')

const fundebug = require('../utils/fundebug')
const logger = global.Logger('res error')

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
  * asuccess response
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
		let code, message, data, stack
		status = status || DEFAULT_ERROR_STATUS
		if (err) {
			if (err instanceof Error) {
				code    = err.code
				message = err.message
				stack   = err.stack
			} else if (typeof err === 'string') {
				message = err
			// 400
			} else if (err instanceof Array) {
				code    = 400
				message = httpCode[status]
				data    = err
			} else if (typeof err === 'object') {
				message = err.message
			} 
			
			code = code || 403
			message = message || 'no message'
			data = data || null

			// make a record in error.log when httpcode = 403
			if(code && code === 403) {
				logger.error({
					method: req.method,
					url: req.originalUrl,
					message: message,
					stack: stack
				})
			}
			// FIXME: delete fundebug
			fundebug.notifyError(err)
			// used in production environment
			if (getconfig['env'] === 'production') {
				return res.status(status).json({
					url: req.originalUrl,
					code: code,
					message: message,
					data: data
				})
			} 
			return res.status(status).json({
				url: req.originalUrl,
				code: code,
				message: message,
				data: data,
				stack: stack
			})
		}
	}
	next()
}
