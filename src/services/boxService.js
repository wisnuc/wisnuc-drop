/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/01 16:59:49 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const _ = require('lodash')
const debug = require('debug')('app:box')
const { User } = require('../models')
const { Box, Tweet } = require('../schema')

/**
 * This is box service.
 * @class BoxService
 */
class BoxService {
	/**
	 * create box
	 * @param {object} options 
	 * @returns 
	 * @memberof BoxService
	 */
  create(options) {
    let box = new Box(options)
    box.save()
    // TODO: send message to client
    return box
  }
	/**
	 * return box
	 * @param {string} boxId 
	 * @returns 
	 * @memberof BoxService
	 */
  async find(boxId) {
    let box = await Box.findOne({ uuid: boxId }).lean().exec()
    if (!box) throw new E.BoxNotExist()
    let user = await User.find({
      where: {
        id: box.owner
      },
      attributes: ['nickName', 'avatarUrl', 'id', 'status'],
      raw: true
    })
    if (!user) throw new E.UserNotExist()
    debug(typeof box)
    debug(`box: ${box}`)
    box.owner = user
    return box
  }
	/**
	 * update box
	 * @param {object} box 
   * @param {object} tweet
	 * @returns
	 * @memberof BoxService
	 */
  update(options, tweet) {
    if (tweet) {
      let tweetObj = {
        type: tweet.type,
        comment: tweet.comment,
        ctime: tweet.ctime,
        parent: tweet.parent,
        index: tweet.index,
        uuid: tweet.uuid,
        box: options.uuid
      }
      new Tweet(tweetObj).save()
    }
    // TODO: send message to client
    Box.findOneAndUpdate({ uuid: options.uuid }, options).exec()
    return null
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
  async findAll(userId) {
    let boxes = await Box.find({ users: userId }).lean().exec()
    let boxIds = _.map(boxes, '_id')
    debug(boxIds)
    let tweets = await tweets.findOne({ box: { $in: boxIds } }).exec()
    let userIds = []
    for (let box of boxes) {
      userIds = userIds.concat(box.users)   
    }
    let users = await User.findAll({
      where: {
        id: userIds
      },
      attributes: ['id', 'nickName', 'avatarUrl', 'status'],
      raw: true
    })
    for (let box of boxes) {
      let boxUsers = []
      for (let boxUserId of box.users) {
        for (let user of users) {
          if (boxUserId === user.id) {
            boxUsers.push(user)
            break
          }
        }  
      }
      box.users = boxUsers
    }
    return boxes
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
	
}

module.exports = new BoxService()
