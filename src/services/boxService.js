/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/07 18:53:50 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('app:box')
const _ = require('lodash')
const { User, Ticket } = require('../models')
const { Box, Tweet } = require('../schema')

/**
 * This is box service.
 * @class BoxService
 */
class BoxService {
	/**
	 * create box
	 * @param {object} options
	 * @memberof BoxService
	 */
  create(options) {
    return Box.findOneAndUpdate({ uuid: options.uuid }, options, { upsert: true })
    // TODO: ssage to client
  }
	/**
	 * return box
	 * @param {string} boxId 
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
	 * @memberof BoxService
	 */
  update(options) {
    return Box.findOneAndUpdate({ uuid: options.uuid }, options)
    // TODO: send message to client
  }
	/**
	 * delete box
	 * @param {any} boxId 
	 * @memberof BoxService
	 */
  delete(boxId) {
    return Box.deleteOne({ uuid: boxId })
  }
	/**
	 * get boxes
	 * @param {any} userId 
	 * @memberof BoxService
	 */
  async findAll(userId) {
   
    let boxes = await Box.find({ users: userId }).lean().exec()
    let boxIds = _.map(boxes, '_id')
    let userIds = []
    for (let box of boxes) {
      userIds = userIds.concat(box.users)
    }
    // last tweet
    let tweets = await Tweet.find({ box: { $in: boxIds } }).sort('field -index').lean().exec()
    let users = await User.findAll({
      where: {
        id: userIds
      },
      attributes: ['id', 'nickName', 'avatarUrl', 'status'],
      raw: true
    })
    for (let box of boxes) {
      debug(11)
      for (let tweet of tweets) {
        debug(333, typeof tweet.box, typeof box._id)
        if (tweet.box.equals(box._id)) {
          debug(22)
          box.tweet = tweet
          break
        }
      }
    }
    debug(tweets)
  
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
   * 1. if boxes exist, create tweets.
   * 2. if boxes don't exist, create boxes && tweets && ticket
   * @param {string} stationId
	 * @param {array} boxes
	 * @memberof BoxService
	 */
  async bulkCreate(stationId, boxes) {
    // insert box
    await Promise.map(boxes, async (item, index) => {
      item = Object.assign({}, item, { stationId: stationId } )
      let box = await Box.findOneAndUpdate({ uuid: item.uuid }, item, { upsert: true, setDefaultsOnInsert: true }).exec()
      debug(box)
      // if the box is newly created, create box's ticket
      if (!box) {
        let ticket = {
          creator: item.owner,
          type: 'share',
          stationId: stationId,
          boxId: item.uuid,
          isAudited: 0 // don't audit
        }
        await Ticket.findOrCreate({
          where: {
            type: ticket.type,
            creator: ticket.creator,
            stationId: ticket.stationId
          },
          defaults: ticket
        })
      }
    })
    let boxIds = _.map(boxes, 'uuid')
    let results = await Box.find({ uuid: { $in: boxIds } }).lean().exec()
    
    let tweets = []
    // add box ObejectId to tweet data
    for (let box of boxes) {
      if (box.tweet) {
        for (let result of results) {
          if (box.uuid === result.uuid) {
            let tweet = Object.assign({}, box.tweet, { box: result._id })
            tweets.push(tweet)
            break
          }
        }
      }
    }
    // insert tweet
    await Promise.map(tweets, async (item, index) => {
      await Tweet.findOneAndUpdate({ index: item.index, box: item.box }, item, { upsert: true, setDefaultsOnInsert: true }).exec()
    })
    return 
    // TODO: send message to client
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
