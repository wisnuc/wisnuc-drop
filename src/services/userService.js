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
	StationServer,
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
				},
				{
					model: StationServer,
					required: false,
					attributes: ['isOnline']
				}
			],
			attributes: ['id', 'name', 'LANIP'],
			raw: true
		})
		stations.map((s) => {
			s.isOnline = s['StationServers.isOnline'] ? true : false
			delete s['StationServers.isOnline']
			s.LANIP = s.LANIP.split(',')
		})
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
