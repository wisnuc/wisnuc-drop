/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 17:49:37 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/23 17:53:15 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')

class UserController extends Controller {
  async index() {
    const { ctx, service } = this
    ctx.joiValidate({
      params: {
        id: Joi.number().required(),
      },
    })
    const data = await service.user.index()
    ctx.success(data)
  }
  async show() {}
  async inviteUser() {}
  async shareBox() {}
  async findAllUser() {}
  async createUser() {}
  async findUser() {}
}

module.exports = UserController
