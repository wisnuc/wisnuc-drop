/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:40:02 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/16 16:50:49 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const Controller = require('egg').Controller

class UserController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.service.user.index()
  }
}

module.exports = UserController
