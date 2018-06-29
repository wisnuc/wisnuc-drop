/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serverService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/02 14:50:33 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 17:41:31 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const os = require('os')
const { Server } = require('../models')

class ServerService {
  /**
   * get LANIP
   * @return {String} LANIP
   */
  _LANIP() {
    let interfaces = os.networkInterfaces()
    for (let devName in interfaces) {
      let iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
  }
  /**
   * server info
   * @return {Object} server
   */
  info() {
    return Server
      .findOne({
        LANIP: this._LANIP()
      })
      .select('-_id WANIP LANIP status')
      .lean()
  }
}

module.exports = new ServerService()
