/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationService.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:00:30 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/08 16:36:19 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const {
	Station, 
	User, 
	UserStation, 
	StationServer
 } = require('../models')

/**
 * This is station service.
 * @class StationService
 */
class StationService {
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
	 * TODO: consider StationUser
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
