/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationService.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:00:30 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 16:32:09 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ursa = require('ursa')
const uuid = require('uuid')

const jwt = require('../lib/jwt')
const {
	Station,
  User,
 } = require('../models')

/**
 * This is station service.
 * @class StationService
 */
class StationService {
	/**
	 * user vist the station, must be in station_user.
	 * @param {any} userId 
	 * @param {any} stationId 
	 * @memberof StationService
	 */
  // async clientCheckStation(userId, stationId) {
  //   let data = await Promise.props({
  //     findStation: UserStation.find({
  //       where: {
  //         userId: userId,
  //         stationId: stationId
  //       },
  //       raw: true
  //     }),
  //     findUser: StationUser.find({
  //       where: {
  //         userId: userId,
  //         stationId: stationId
  //       },
  //       raw: true
  //     })
  //   })
  //   return data.findStation && data.findUser ? true : false
  // }
	/**
	 * create new station
	 * @param {object} station 
	 * @memberof StationService
	 */
  create(station) {
    return Station.create(station)
  }
	/**
	 * get station
	 * @param {String} stationId 
	 * @memberof StationService
	 */
  find(stationId) {
    return Station
      .findOne({ _id: stationId })
      .select('-publicKey')
      .lean()
  }
	/**
	 * update station
	 * @param {object} station - station object 
   * @memberof StationService
	 */
  update(station) {
    return Station.update({ _id: station.id }, station)
  }
	/**
	 * update users
	 * clear station_user and bulk create.
	 * @param {String} stationId - station uuid
	 * @param {Array} usersId - user uuid array
	 * @memberof StationService
	 */
  updateUsers(stationId, usersId) {
    return Station.update({ _id: stationId }, { users: usersId })
  }
	/**
	 * delete station
	 * @param {String} stationId 
	 * @memberof StationService
	 */
  delete(stationId) {
    return Station.deleteOne({ _id: stationId })
  }
	/**
	 * user list
	 * @param {String} stationId
	 * @memberof StationService
	 */
  async findUsers(stationId) {
    const station = await Station
      .findOne({ _id: stationId })
      .populate({ path: 'users', select: '-unionId -stations' })
      .lean()
    return station.users
  }
	/**
	 * update station online
	 * @param {String} stationId
	 * @param {Boolean} flag
   * @memberof StationService
	 */
  updateOnline(stationId, flag) {
    return Station.update({ _id: stationId }, { isOnline: !!flag })
  }
	/**
	 * get station token
	 * @param {String} stationId
   * @memberof StationService
	 */
  async getToken(stationId) {
    const station = await Station
      .findOne({ _id: stationId })
      .lean()
    if (!station) throw new E.StationNotExist()
    // random number
    const seed = uuid.v4()
    const crt = ursa.createPublicKey(station.publicKey)
    const encryptData = crt.encrypt(seed, 'utf8', 'base64')
    const token = {
      station: {
        id: station._id,
        name: station.name,
      },
    }
    return { seed, encryptData, token: jwt.encode(token) }
  }
   /**
	 * return double arrow checked stations
	 * @param {String} userId - user uuid
	 * @return {Array} stations - station list
	 */
  async getCheckedStations(userId) {
    const data = await Promise.props({
      user: User
        .findOne({ _id: userId })
        .select('-unionId')
        .populate({ path: 'stations', select: '-publicKey -users' })
        .lean(),
      stationList: Station
        .find({ users: userId })
        .select('-publicKey')
        .lean(),
    })
    const { user, stationList } = data
    const stations = user.stations
    const stationArr = []
    for (const station of stations) {
      for (const s of stationList) {
        if (station._id === s._id) stationArr.push(s)
      }
    }
    return stationArr
  }
}

module.exports = new StationService()
