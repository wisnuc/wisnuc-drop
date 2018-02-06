/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ip.js                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/20 16:52:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/06 15:36:37 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const os = require('os')
const publicIp = require('public-ip')

module.exports = {
	/**
	 * get local ip
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
  },
	/**
	 * get wan ip
   * FIXME: socket handle up
	 * @returns {string} WANIP
	 */
  WANIP() {
    return publicIp.v4()
  }
}



