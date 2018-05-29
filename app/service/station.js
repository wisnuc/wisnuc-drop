/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 16:40:23 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const Promise = require('bluebird')
const _ = require('lodash')
const uuid = require('uuid')
const ursa = require('ursa')

const E = require('../lib/error')
const jwt = require('../lib/jwt')

/**
 * This is station service.
 * @class StationService
 */
class StationService extends Service {
  /**
	 * get stationId information
	 * @param {String} stationId - station uuid
	 * @return {Object} station - station info
	 */
  async show(stationId) {
    const { ctx } = this
    return ctx.model.Station
      .findOne({ _id: stationId })
      .select('-publicKey')
      .lean()
  }
  /**
	 * create new station
	 * @param {Object} station - station object
   * @return {Object} station - station info
	 */
  async create(station) {
    const { ctx } = this
    return ctx.model.Station.create(station)
  }
  /**
	 * update station
	 * @param {Object} station - station object
   * @memberof StationService
   * @return {Boolean} boolean - true or false
	 */
  async update(station) {
    const { ctx } = this
    return ctx.model.Station.update({ _id: station.id }, station)
  }
  /**
	 * update users
	 * clear station_user and bulk create.
	 * @param {String} stationId - station uuid
	 * @param {Array} usersId - user uuid array
	 * @memberof StationService
   * @return {Boolean} boolean - true or false
	 */
  async updateUsers(stationId, usersId) {
    const { ctx } = this
    return ctx.model.Station.update({ _id: stationId }, { users: usersId })
  }
  /**
	 * delete station
	 * @param {String} stationId - station uuid
	 * @memberof StationService
   * @return {Boolean} boolean - true or false
	 */
  async delete(stationId) {
    const { ctx } = this
    return ctx.model.Station.deleteOne({ _id: stationId })
  }
  /**
	 * list user
	 * @param {String} stationId - station uuid
	 * @memberof StationService
   * @return {Array} users - user list
	 */
  async findUsers(stationId) {
    const { ctx } = this
    const station = await ctx.model.Station
      .findOne({ _id: stationId })
      .populate({ path: 'users', select: '-unionId -stations' })
      .lean()
    return station.users
  }
  /**
	 * update station online
	 * @param {String} stationId - station uuid
	 * @param {Boolean} flag - true pr false
   * @memberof StationService
   * @return {Boolean} boolean - true or false
	 */
  async updateOnline(stationId, flag) {
    const { ctx } = this
    return ctx.model.Station.update({ _id: stationId }, { isOnline: !!flag })
  }
  /**
	 * get station token
	 * @param {String} stationId - station uuid
   * @memberof StationService
   * @return {Object} token - token for station
	 */
  async getToken(stationId) {
    const { ctx } = this
    const station = await ctx.model.Station
      .findOne({ _id: stationId })
      .select('name')
      .lean()
    if (!station) throw new E.StationNotExist()
    // random number
    const seed = uuid.v4()
    const crt = ursa.createPublicKey(station.publicKey)
    const encryptData = crt.encrypt(seed, 'utf8', 'base64')
    const token = {
      station: {
        id: station.id,
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
  async getCheckedStations (userId) {
    const { ctx } = this
    const data = await Promise.props({
      user: ctx.model.User
        .findOne({ _id: userId })
        .select('-unionId')
        .populate({ path: 'stations', select: '-publicKey -users' })
        .lean(),
      stationList: ctx.model.Station
        .find({ users: userId })
        .select('-publicKey')
        .lean()
    })
    const { user, stationList } = data
    const { stations } = data.user
    let stationArr = []
    for (const station of stations) {
      for (const s of stationList) {
        if (station._id === s._id) stationArr.push(s)
      }
    }
    return stationArr
  }
}

module.exports = StationService
