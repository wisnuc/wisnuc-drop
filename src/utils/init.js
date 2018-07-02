/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/02 17:25:32 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const serverService = require('../services/serverService')

// global server
module.exports = () => {
  return new Promise(async () => {
    const server = await serverService.info()
    if (!server) {
      console.error('server not found') // eslint-disable-line
      process.exit(1)
    }
    global.server = server
  })
}
