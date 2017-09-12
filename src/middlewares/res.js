/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   res.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:57:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/12 15:54:33 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { getconfig } = require('getconfig')

const fundebug = require('../utils/fundebug')
const Logger = require('../utils/logger').Logger('system error')

const DEFAULT_SUCCESS_STATUS = 200
const DEFAULT_ERROR_STATUS = 403

//http code 
const httpCode = {
	200: 'ok',
	400: 'invalid parameters',
	401: 'Authentication failed',
	403: 'forbidden', // 
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
			code: status,
			message: httpCode[status],
			data: data
		})
	}

  /**
 * error response 
 * @param {any} data 
 * @param {number} status - default 403
 */
	res.error = (err, status) => {
		let message, data, stack
		status = status || DEFAULT_ERROR_STATUS
		if (err) {
			if (err instanceof Error) {
				message = err.message
				stack = err.stack
			} else if (typeof err === 'string') {
				message = err
			// 400
			} else if (err instanceof Array) {
				message = httpCode[status]
				data = err
			} else if (typeof err === 'object') {
				message = err.message
			} 
				
			// log
			Logger.error({
				method: req.method,
				url: req.originalUrl,
				message: message,
				stack: stack || null
			})
				
			if (getconfig['env'] === 'production') {
				// used in production environment
				
				// fundebug.notifyError(err)

				return res.status(status).json({
					code: status || 'no code',
					message: message || 'no message',
					data: data || null
				})
			} 
			
			return res.status(status).json({
				code: status || 'no code',
				message: message || 'no message',
				data: data || null,
				stack: stack
			})
		}
	}
	next()
}
