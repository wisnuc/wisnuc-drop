// /* ************************************************************************** */
// /*                                                                            */
// /*                                                        :::      ::::::::   */
// /*   mqttService.js                                     :+:      :+:    :+:   */
// /*                                                    +:+ +:+         +:+     */
// /*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
// /*                                                +#+#+#+#+#+   +#+           */
// /*   Created: 2017/12/05 15:26:17 by Jianjin Wu        #+#    #+#             */
// /*   Updated: 2017/12/15 15:40:42 by Jianjin Wu       ###   ########.fr       */
// /*                                                                            */
// /* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:service:server')
const os = require('os')

/**
 * This is server service.
 * @class ServerService
 */
class ServerService extends Service {
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
   * if no server information, create server info.
   * @return {Object} server
   */
  info() {
    return this.ctx.model.Server
      .findOne({
        LANIP: this._LANIP()
      })
      .select('-_id WANIP LANIP status')
      .lean()
  }
}

module.exports = ServerService
