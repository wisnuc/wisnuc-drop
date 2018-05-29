/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/19 16:59:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 17:31:20 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = app => {
  if (app.config.mqtt) require('./app/lib/mqtt')(app)
  global.E = require('./app/lib/error')
}
