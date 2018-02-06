/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   serverService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/02 14:50:33 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/06 17:46:31 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * TODO: deprecated
 */
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
  async serverInfo() {
    let LANIP = ip.LANIP()
    let WANIP = await ip.WANIP()
  
    return Server.find({
      where: {
        WANIP: WANIP,
        LANIP: LANIP
      
      },
      raw: true
    })
  }
 
}

module.exports = new ServerService()
