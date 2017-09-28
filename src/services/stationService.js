/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationService.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:00:30 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/22 14:58:34 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const {
	Station, 
	User, 
	UserStation, 
	StationUser,
	WisnucDB
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
	async clientCheckStation(userId, stationId) {
		let data = await Promise.props({
			findStation: UserStation.find({
				where: {
					userId: userId,
					stationId: stationId
				},
				raw: true
			}),
			findUser: StationUser.find({
				where: {
					userId: userId,
					stationId: stationId
				},
				raw: true
			})
		})
		return data.findStation && data.findUser ? true : false
	}
	/**
	 * create new station
	 * @param {object} station 
	 * @returns 
	 * @memberof StationService
	 */
	create(station) {
		return Station.create(station)
	}
	/**
	 * get station
	 * @param {string} id 
	 * @returns 
	 * @memberof StationService
	 */
	find(id) {
		return Station.find({
			where: {
				id: id
			},
			attributes: ['id', 'name']
		})
	}
	/**
	 * update station
	 * @param {object} obj 
	 * @param {string} id
	 * @returns {boolean} true 
	 */
	update(station) {
		return Station.update(station, {
			where: {
				id: station.id
			}
		})
	}
	/**
	 * update users
	 * clear station_user and bulk create. 
	 * @param {any} stationId 
	 * @param {any} usersId 
	 * @memberof StationService
	 */
	updateUsers(stationId, usersId) {
		return WisnucDB.transaction(async t => {
			await StationUser.destroy({
				where: {
					stationId: stationId
				},
				transaction: t,
				raw: true
			})
			let arr = []
			usersId.forEach(userId => {
				arr.push({
					userId: userId,
					stationId: stationId
				})
			})
			await StationUser.bulkCreate(arr, {transaction: t})
		})
	}
	/**
	 * delete station
	 * @param {string} id 
	 * @returns 
	 * @memberof StationService
	 */
	delete(id) {
		return Station.update({status: -1}, {
			where: {
				id: id
			}
		})
	}
	/**
	 * user list
	 * @param {any} id
	 * @memberof StationService
	 */
	findUsers(id) {
		return User.findAll({
			include: {
				model: UserStation,
				as: 'stations',
				where: {
					stationId: id
				},
				attributes: ['stationId']
			}
		})
	}
}

module.exports = new StationService()
