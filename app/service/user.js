/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/23 17:42:33 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service

/**
 * This is user service.
 * @class UserService
 */
class UserService extends Service {
  /**
	 * get user information
	 * @param {String} userId - user uuid
	 * @return {Object} user - user info
	 */
  async show(userId) {
    const { ctx } = this
    const data = await ctx.model.User.find({
      
    })
    return data
  }
  /**
	 * create new user
	 * @param {Object} user - user object
   * @return {Object} user - user info
	 */
  async create(user) {
    const { ctx } = this
    return await ctx.model.User.create(user)
  }
  async findStations() {

  }
  async findInteresting() {}
  async findInterestingSources() {}
}

module.exports = UserService
