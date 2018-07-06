/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/06 13:45:52 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:user')
const _ = require('lodash')

const E = require('../lib/error')
const { User, Box, Station } = require('../models')
const stationService = require('./stationService')

/**
 * This is user service.
 * @class UserService
 */
class UserService {
	/**
	 * create new user
	 * @param {Object} user 
	 * @memberof UserService
	 */
  create(user) {
    return User.create(user)
  }
	/**
	 * get user information
	 * @param {String} userId 
	 * @returns {Object} user 
	 */
  async find(userId) {
    let user = await User
    .findOne({ _id: userId })
    .select('-unionId')
    .lean()
    if (!user) throw new E.EUSERNOTEXIST()
    debug(`user_info: ${user}`)
    return user
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
	 * @param {String} userId 
	 * @returns {Array} stations 
	 */
  async findStations(userId) {
    const data = await Promise.props({
      user: User
        .findOne({ _id: userId })
        .select('-unionId')
        .populate({ path: 'stations', select: '-publicKey -users' })
        .lean(),
      stationUsers: Station
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
   * @param {String} userId 
   * @memberof UserService
   */
  async findInteresting(userId) {
    const data = await Promise.props({
      // boxes I own and boxes including me
      boxes: Box.find({ users: userId }).select('users'),
      // stations I own and stations including me
      stations: stationService.getCheckedStations(userId)
    })
    const { boxes, stations } = data
    let userIds = []
    if (Array.isArray(boxes) && boxes.length > 0) {
      for (const box of boxes) {
        userIds = userIds.concat(box.users)
      }
    }
    if (Array.isArray(stations) && stations.length > 0) {
      userIds = userIds.concat(_.flatMapDeep(_.map(stations, 'users')))
    }
    userIds = userIds.filter(u => u != userId)
    const users = await User
      .find({ _id: userIds })
      .select('-unionId')
      .lean()
    return users
  }
  /**
   * return interesting person data sources
   * @param {String} userId 
   * @memberof UserService
   */
  async findInterestingSources(userId) {
    const stations = await stationService.getCheckedStations(userId)
    const stationIds = _.map(stations, 'id')
    let boxes = await Box
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

module.exports = new UserService()
