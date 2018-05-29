/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 16:24:07 by Jianjin Wu       ###   ########.fr       */
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
   * return user list
   * @param {Array} userIds
   * @return {Array} users
   */
  async index(userIds) {
    const { ctx } = this
    return ctx.model.User
      .find({ _id: userIds })
      .select('-unionId')
      .lean()
  }
  /**
	 * get user information
	 * @param {String} userId - user uuid
	 * @return {Object} user - user info
	 */
  show(userId) {
    const { ctx } = this
    return ctx.model.User
      .findOne({ _id: userId })
      .select('-unionId')
      .lean()
  }
  /**
	 * create new user
	 * @param {Object} user - user object
   * @return {Object} user - user info
	 */
  async create(user) {
    const { ctx } = this
    await ctx.model.User.create(user)
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
  async index (userId) {
    const { ctx } = this
    const data = await Promise.props({
      user: ctx.model.User
        .findOne({ _id: userId })
        .select('-unionId')
        .populate({ path: 'stations', select: '-publicKey -users' })
        .lean(),
      stationUsers: ctx.model.Station
        .find({ users: userId })
        .select('_id')
        .lean()
    })
    const { user, stationUsers } = data
    const { stations } = data.user
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
    const { ctx } = this
    const data = await Promise.props({
      // boxes I own and boxes including me
      boxes: ctx.model.Box.find({ users: userId }).select('users'),
      // stations I own and stations including me
      stations: ctx.service.station.getCheckedStations(userId)
    })
    const { boxes, stations } = data
    let userIds = []
    if (Array.isArray(boxes) && boxes.length > 0) {
      for (let box of boxes) {
        userIds = userIds.concat(box.users)
      }
    }
    if (Array.isArray(stations) && stations.length > 0) {
      userIds = userIds.concat(_.flatMapDeep(_.map(stations, 'users')))
    }
    userIds = userIds.filter(u => u != userId)
    return this.index(userIds)
  }
  /**
   * return interesting person data sources
   * @param {String} userId -user uuid
   */
  async findInterestingSources(userId) {
    const { ctx } = this
    const stations = await ctx.service.station.getCheckedStations(userId)
    const stationIds = _.map(stations, 'id')
    let boxes = await ctx.model.Box
      .find({ stationId: { $in: stationIds } })
      .select('name stationId')
      .lean()
    for (let station of stations) {
      station.boxes = []
      for (let box of boxes) {
        if (station.id === box.stationId) station.boxes.push(box)
      }
    }
    return stations
  }
}

module.exports = UserService
