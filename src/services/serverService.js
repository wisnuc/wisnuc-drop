/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serverService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/02 14:50:33 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/02 18:07:30 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Server } = require('../models')

const ip = require('../utils/ip')

class ServerService {
  constructor() {
    this.WANIP = ip.WANIP()
    this.LANIP = ip.LANIP()
  }
  /**
   * 
   */
  findServers() {
    return Server.findAll({
      where: {
        status: 1
      },
      raw: true
    })
  }
  /**
   * @param {string} WANIP 
   */
  isSame(WANIP) {
    return WANIP != this.WANIP ? false : true
  }
  /**
   * @param {string} hostname 
   */
  exist(hostname) {
    
  }
}

module.exports = new ServerService()