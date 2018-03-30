/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:user')
const _ = require('lodash')
const E = require('../lib/error')
const {
	User,
  UserStation,
  Station,
  StationUser,
  WisnucDB
 } = require('../models')
const { Box } = require('../schema')

/**
 * This is user service.
 * @class UserService
 */
class UserService {
	/**
	 * create new user
	 * @param {object} user 
	 * @memberof UserService
	 */
  create(user) {
    return User.create(user)
  }
	/**
	 * get user information
	 * @param {string} userId 
	 * @returns {object} user 
	 */
  async find(userId) {
    let user = await User.find({
      where: {
        id: userId
      },
      include: {
        model: UserStation,
        as: 'stations',
        required: false,
        where: {
          userId: userId,
          status: 1
        },
        attributes: ['stationId']
        // attributes: [ [Sequelize.col('stationId'), 'id'] ]
      }
    })
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
	 * @param {string} userId 
	 * @returns {array} stations 
	 */
  async findStations(userId) {

    let stations = await Station.findAll({
      include: [
        {
          model: UserStation,
          where: {
            userId: userId
          },
          attributes: [],
        }
      ],
      attributes: ['id', 'name', 'isOnline', 'LANIP'],
      raw: true
    })
    if (stations.length < 1) return stations

    let stationIds = _.map(stations, 'id')
    let stationCopys = await StationUser.findAll({
      where: {
        userId: userId,
        stationId: { $in: stationIds }
      },
      attributes: ['stationId'],
      raw: true
    })

    for (let station of stations) {
      station.isOnline = Boolean(station.isOnline)
      station.LANIP = station.LANIP ? station.LANIP.split(',') : null
      station.isValid = false
      for (let sc of stationCopys) {
        if (station.id === sc.stationId) {
          station.isValid = true
          break
        }
      }
    }
    return stations
  }
  /**
   * 1. There are users of the box I own and the users in the box including me.
   * 2. There are users of the station I own and the users in the station including me(check double arrow).
   * @param {string} userId 
   * @memberof UserService
   */
  async findInteresting(userId) {
    // need to check double arrow
    const sqlQuery = 
      `SELECT 
        su.userId, su.stationId
      FROM
        station_user AS su,
        (SELECT 
          u.userId, u.stationId
        FROM
          user_station AS u, (SELECT 
          stationId
        FROM
          user_station
        WHERE
          userId = '${userId}') AS us
        WHERE
          u.stationId = us.stationId) AS res
      WHERE
        su.stationId = res.stationId
          AND su.userId = res.userId`
    // const sqlQuery = `select u.userId from user_station as u, 
    //   (select stationId from user_station where userId = '${userId}') as us 
    let data = await Promise.props({
      // boxes I own and boxes including me
      boxes: Box.find({ users: userId }, { users: 1 }).exec(),
      // stations I own and stations station me
      stationUsers: WisnucDB.query(sqlQuery, { 
        // raw: true, 
        // type: WisnucDB.QueryTypes.SELECT,
        nest: true // deduplication
      })
    })
    let { boxes, stationUsers } = data
    let userIds = []
    if (Array.isArray(boxes) && boxes.length > 0) {
      for (let box of boxes) {
        userIds = userIds.concat(box.users)
      }
    }
    if (Array.isArray(stationUsers) && stationUsers.length > 0) {
      userIds = userIds.concat(_.map(stationUsers, 'userId'))
    }
    // return users info
    return User.findAll({
      where: {
        id: userIds
      },
      attributes: ['id', 'nickName', 'avatarUrl'],
      raw: true
    })
  }
  /**
   * return interesting person data sources
   * @param {string} userId 
   * @memberof UserService
   */
  async findInterestingSources(userId) {
    
    let stations = await Station.findAll({
      include: [
        {
          model: UserStation,
          where: {
            userId: userId
          },
          attributes: []
        },
        {
          model: StationUser,
          where: {
            userId: userId
          },
          attributes: []
        }
      ],
      attributes: ['id', 'name', 'LANIP'],
      raw: true
    })

    let stationIds = _.map(stations, 'id')
    let boxes = await Box.find({ stationId: { $in: stationIds } }, { name: 1, stationId: 1, uuid: 1 }).exec()
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
