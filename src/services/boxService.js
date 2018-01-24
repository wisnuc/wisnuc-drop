/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/24 16:17:30 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:box')
const { User} = require('../models')
const { Box } = require('../schema')

/**
 * This is box service.
 * @class BoxService
 */
class BoxService {
	/**
	 * create new box
	 * @param {object} options 
	 * @returns 
	 * @memberof BoxService
	 */
  create(options) {
    let box = new Box(options)
    box.save()
    return box
  }
	/**
	 * get box
	 * @param {any} boxId 
	 * @returns 
	 * @memberof BoxService
	 */
  async find(boxId) {
    
    let box = await Box.findOne({ uuid: boxId }).exec()
    if (!box) throw new E.BoxNotExist()
    
    let user = await User.find({
      where: {
        id: box.owner
      },
      attributes: ['nickName', 'avatarUrl', 'id', 'status'],
      raw: true
    })
    if (!user) throw new E.UserNotExist()
    
    box.owner = user
    return box
  }
	/**
	 * update box
	 * @param {object} box 
	 * @returns
	 * @memberof BoxService
	 */
  update(options) {
    return Box.findOneAndUpdate({ uuid: options.uuid }, options).exec()
  }
	/**
	 * delete box
	 * @param {any} boxId 
	 * @returns 
	 * @memberof BoxService
	 */
  delete(boxId) {
    return Box.deleteOne({ uuid: boxId })
  }
	/**
	 * get boxes
	 * @param {any} userId 
	 * @returns 
	 * @memberof BoxService
	 */
  findAll(userId) {
    return Box.find().exec()
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
    return Promise.map(boxes, function (box) {
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
    return Box.update({ status: -1 }, {
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
        attributes: []
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
