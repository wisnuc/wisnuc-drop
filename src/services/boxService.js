/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/04 10:32:29 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Box, User, BoxUser, UserBox } = require('../models')

/**
 * This is box service.
 * @class BoxService
 */
class BoxService {
	/**
	 * create new box
	 * @param {any} options 
	 * @returns 
	 * @memberof BoxService
	 */
	create(options) {
		return Box.create(options)
	}
	/**
	 * get box
	 * @param {any} boxId 
	 * @returns 
	 * @memberof BoxService
	 */
	find(boxId) {
		return Box.find({
			where: {
				id: boxId
			}
		})
	}
	/**
	 * update box
	 * @param {object} box 
	 * @returns {number} count - effect raw count
	 * @memberof BoxService
	 */
	update(box) {
		return Box.update(box, {
			where: {
				id: box.id
			}
		})
	}
	/**
	 * delete box
	 * @param {any} boxId 
	 * @returns 
	 * @memberof BoxService
	 */
	delete(boxId) {
		return Box.update({ status: -1 }, {
			where: { id: boxId }
		})
	}
	/**
	 * get boxes
	 * @param {any} userId 
	 * @returns 
	 * @memberof BoxService
	 */
	findAll(userId) {
		return Box.findAll({
			include: {
				model: UserBox,
				where: {
					userId: userId
				}
			}
		})
	}
	/**
	 * create boxes
	 * @param {array} boxes 
	 * @returns 
	 * @memberof BoxService
	 */
	bulkCreate(boxes) {
		return Box.bulkCreate(boxes)
	}
	/**
	 * update boxes
	 * @param {array} boxes 
	 * @memberof BoxService
	 */
	bulkUpdate(boxes) {
		return Promise.map(boxes, function(box) {
			return Box.update(box, {
				where: {
					id: box.id
				}
			})
		})
	}
	/**
	 * destroy boxes
	 * @param {array} ids 
	 * @memberof BoxService
	 */
	bulkDestroy(ids) {
		return Box.update({status: -1}, {
			where: {
				id: ids
			}
		})
	}
	/**
	 * get owner
	 * @param {any} id 
	 * @param {any} onwerId 
	 * @memberof BoxService
	 */
	findOwner(id, onwerId) {
		return User.find({
			include: {
				model: Box,
				where: {
					id: id,
					onwerId: onwerId
				},
				attributes:[]
			}
		})
	}
	/**
	 * get user
	 * @param {any} id 
	 * @param {any} userId 
	 * @memberof BoxService
	 */
	findUser(id, userId) {
		return User.find({
			include: {
				model: BoxUser,
				where: {
					boxId: id,
					userId: userId
				},
				attributes: []
			}
		})
	}
}

module.exports = new BoxService()
