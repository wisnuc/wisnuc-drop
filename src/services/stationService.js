/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationService.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:00:30 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/12 16:43:37 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ursa = require('ursa')
const uuid = require('uuid')

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
	/**
	 * update station online
	 * @param {*} stationId
	 * @param {boolean} flag
	 */
	updateOnline(stationId, flag) {
		let isOnline = flag ? 1 : 0
		return Station.update({isOnline: isOnline}, {
			where: {
				id: stationId
			}
		})
	}
	/**
	 * get station token
	 * @param {*} stationId 
	 */
	async getToken(stationId) {
		
		
		let station = await Station.find({
			where: {
				id: stationId
			},
			attirbutes: ['id', 'name', 'publicKey'],
			raw: true
		})
		
		if (!station) throw E.StationNotExist()
		
		// random number
		let seed = uuid.v4()
		let crt = ursa.createPublicKey(station.publicKey)
		let encryptData = crt.encrypt(seed, 'utf8', 'base64')
		
		let token = {
			station: {
				id: station.id,
				name: station.name
			}
		}
		return { seed, encryptData, token }
	}
}

module.exports = new StationService()
