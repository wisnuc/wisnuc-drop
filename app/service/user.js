/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/18 15:48:26 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service

class UserService extends Service {
  async index() {
    const { ctx } = this
    const list = await ctx.model.User.find()
    return list
  }
}

module.exports = UserService
