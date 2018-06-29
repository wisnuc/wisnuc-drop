/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 17:41:49 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const serverService = require('../services/serverService')

// global server
module.exports = () => {
  return new Promise(async () => {
    global.server = await serverService.info()
  })
}
