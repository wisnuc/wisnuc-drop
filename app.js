/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/19 16:59:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/31 15:11:44 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = app => {
  if (app.config.mqtt) require('./app/lib/mqtt')(app)
  app.beforeStart(async () => {
    // 也可以通过以下方式来调用 Service
    const ctx = app.createAnonymousContext()
    // init global info
    const server = await ctx.service.server.info()
    console.log(123123123, server);
    global.server = server
    global.E = require('./app/lib/error')
  })
}
