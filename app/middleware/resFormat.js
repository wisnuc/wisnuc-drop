/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   resFormat.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/18 11:22:28 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/23 16:11:40 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = () => {

  const DEFAULT_SUCCESS_STATUS = 200
  const DEFAULT_ERROR_STATUS = 403

  // http code
  const httpCode = {
    200: 'ok',
    400: 'invalid parameters',
    401: 'authentication failed',
    403: 'forbidden',
    404: 'not found',
  }

  return async (ctx, next) => {
    /**
    * success response
    * @param {object} data - response data
    * @param {number} status - default 200
    */
    ctx.success = (data, status) => {
      ctx.status = status || DEFAULT_SUCCESS_STATUS
      ctx.body = {
        url: ctx.request.originalUrl,
        errcode: 1,
        errmsg: 'ok',
        data: data || null,
      }
    }
    /**
    * error response
    * @param {any} error - Error
    * @param {number} status - default 403
    */
    ctx.error = (error, status) => {
      let code
      let message
      status = status || DEFAULT_ERROR_STATUS
      if (error) {
        if (error instanceof Error) {
          code = error.code || status
          message = error.message
        } else if (error instanceof Array) {
          // 400
          code = 400
          message = httpCode[status]
        } else {
          // others
          code = error.code || status || 403
          message = error.message || httpCode[status] || 'forbidden'
        }
        // TODO: error log

      }
      ctx.status = status
      ctx.body = {
        url: ctx.request.originalUrl,
        errcode: code,
        errmsg: message,
      }

    }
    await next()
  }

}
