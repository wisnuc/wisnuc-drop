/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   baseController.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 17:37:40 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/17 18:07:51 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')

class BaseController extends Controller {
  get user() {
    return this.ctx.session.user
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data,
    }
  }

  notFound(msg) {
    msg = msg || 'not found'
    this.ctx.throw(404, msg)
  }
}
module.exports = BaseController
