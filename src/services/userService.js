/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userService.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/09 18:09:26 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/30 18:05:52 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const _ = require('lodash')
const E = require('../lib/error')
const { 
	User, 
	UserStation, 
	Station,
	StationUser,
	Box, 
	BoxUser
 } = require('../models')

/**
 * This is user service.
 * @class UserService
 */
class UserService {
	/**
	 * create new user
	 * @param {object} user 
	 * @returns 
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
		return user
	}
	/**
	 * update user
	 * @param {any} user 
	 * @memberof UserService
	 */
	update(user) {
		return User.update(user, {
			where: {
				id: user.id
			}
		})
	}
	/**
	 * delete user
	 * @param {any} userId 
	 * @memberof UserService
	 */
	delete(userId) {
		return User.update({status: -1}, {
			where: {
				id: userId
			}
		})
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
				stationId: {$in: stationIds }
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
	 * get friends TODO:
	 * 1. users in the boxes owned by me.
	 * 2. users created boxes, and I was in the boxes. 
	 * @param {any} userId 
	 * @memberof UserService
	 */
	findFriends(userId) {
		let result = Promise.props({
			ownerIds: BoxUser.findAll({
				include: {
					model: Box,
					where: {
						ownerId: userId
					}
				},
				attributes: ['userId']
			}),
			userIds: Box.findAll({
				include: {
					model: BoxUser,
					as: 'users',
					where: {
						userId: userId
					}
				},
				attributes: ['ownerId']
			})
		})
		let { ownerIds, userIds } = result
		let friendIds = _.union(ownerIds, userIds)
		// friendIds
		return User.findAll({
			where: {
				id: friendIds
			}
		})
	}
}

module.exports = new UserService()
