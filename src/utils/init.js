/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/21 10:23:17 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/28 11:52:07 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const os = require('os')
const publicIp = require('public-ip')
const { Server } = require('../models')

/**
 * According to different server, init data.
 * @class InitService
 */
class InitService {
  /**
   * get LANIP
   * @returns {string} LANIP
   */
  LANIP() {
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
   */
  register() {
    return new Promise(async (resolve, reject) => {
      try {
        let LANIP = this.LANIP()
        let WANIP = await publicIp.v4()

        return Server.findOrCreate({
          where: {
            $or: [
              { LANIP: LANIP },
              { WANIP: WANIP }
            ]
          },
          defaults: {
            LANIP: LANIP,
            WANIP: WANIP
          }
        }).spread(function (newObj, created) {
           // add to global
          global.server = newObj.dataValues
          if (created) return newObj
          return newObj.save()
        })
      }
      catch (err) {
        reject(err)
      }
  
    })
  }
}


module.exports = new InitService()
