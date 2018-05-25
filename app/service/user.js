/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 15:11:01 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const Promise = require('bluebird')
const _ = require('lodash')

const E = require('../lib/error')

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
    const user = await ctx.model.User
      .findOne({ _id: userId })
      .select('-unionId')
      .lean()
    if (!user) throw new E.EUSERNOTEXIST()
    return user
  }
  /**
	 * create new user
	 * @param {Object} user - user object
   * @return {Object} user - user info
	 */
  async create(user) {
    const { ctx } = this
    return ctx.model.User.create(user)
  }
  /**
	 * get stations
	 * 查询 station_server, 若有一台机器在线则认为 station 在线，反之则不在线
	 * data [
        {
					"id": "4e286576-d459-4ea1-81d7-7e957cd3e41c",
					"name": "HomeStation",
					"LANIP": [
							"10.10.9.239"
					],
					"isOnline": false,
          "isValid": true
        },
        {
					"id": "0686031d-a7b4-4b58-8994-0784661d0a8f",
					"name": "HomeStation",
					"LANIP": [
							"10.10.9.130"
					],
					"isOnline": true,
          "isValid": false
        }
    ]
	 * @param {String} userId - user uuid
	 * @return {Array} stations - station list
	 */
  async findStations(userId) {
    const { ctx } = this
    const user = await ctx.model.User
      .findOne({ _id: userId })
      .select('-unionId')
      .populate({ path: 'stations', select: '-publicKey -users' })
      .lean()
    const { stations } = user
    const stationUsers = await ctx.model.Station
      .find({ users: { $in: [ userId ] } })
      .select('_id')
      .lean()
    for (const station of stations) {
      station.isValid = false
      for (const su of stationUsers) {
        if (station._id === su._id) station.isValid = true
      }
    }
    return stations
  }
  /**
   * 1. There are users of the box I own and the users in the box including me.
   * 2. There are users of the station I own and the users in the station including me(check double arrow).
   * @param {String} userId - user uuid
   * @return {Array} users - interesting users
   */
  async findInteresting(userId) {

  }
  /**
   * return interesting person data sources
   * @param {String} userId -user uuid
   */
  async findInterestingSources() {}
}

module.exports = UserService
