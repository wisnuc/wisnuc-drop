/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 16:14:44 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/24 10:35:45 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')

class TokenController extends Controller {

  async oauth2() {
    const { ctx, service } = this
    const data = await service.token.oauth2()
    ctx.success(data)
  }

  async mpToken() {
    const { ctx, service } = this
    const data = await service.token.mpToken()
    ctx.success(data)
  }
}

module.exports = TokenController
