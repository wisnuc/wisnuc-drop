/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 16:26:52 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('app:box')
const _ = require('lodash')
const { User, Station, Ticket } = require('../models')
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
  }
	/**
	 * return box
	 * @param {string} boxId 
	 * @memberof BoxService
	 */
  async find(boxId) {
    let box = await Box.findOne({ uuid: boxId }).lean()
    if (!box) throw new E.BoxNotExist()
    let users = await User.findAll({
      where: {
        id: box.users
      },
      attributes: ['nickName', 'avatarUrl', 'id', 'status'],
      raw: true
    })
    if (!users) throw new E.UserNotExist()
    debug(`box: ${box}`)
    box.users = users
    return box
  }
	/**
	 * update box
	 * @param {object} box 
	 * @memberof BoxService
	 */
  update(options) {
    return Box.findOneAndUpdate({ uuid: options.uuid }, options)
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
    
    let boxes = await Box.find({ users: userId }).lean()
    let boxIds = _.map(boxes, '_id')
    let stationIds = _.map(boxes, 'stationId')
    let userIds = _.uniq(_.flatMapDeep(_.map(boxes, 'users')))
    let data = await Promise.props({
      stations: Station.findAll({
        where: {
          id: stationIds
        },
        attributes: ['id', 'status', 'name', 'isOnline', 'LANIP'],
        raw: true
      }),
      users: User.findAll({
        where: {
          id: userIds
        },
        attributes: ['id', 'nickName', 'avatarUrl', 'status'],
        raw: true
      }),
      // last tweet // FIXME: bug
      tweets: Tweet.find({ box: { $in: boxIds } }).sort({ index: -1 }).lean()
    })
    let { users, stations, tweets } = data
    // assembly data
    for (let box of boxes) {
      for (let station of stations) {
        if (box.stationId === station.id) {
          box.station = station
          break
        }
      }
      for (let tweet of tweets) {
        if (tweet.box.equals(box._id)) {
          box.tweet = tweet
          break
        }
      }
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
   * 1. if boxes exist, delete deprecated boxes and create tweets.
   * 2. if boxes don't exist, create boxes && tweets && ticket.
   * @param {string} stationId
	 * @param {array} boxes
	 * @memberof BoxService
	 */
  async bulkCreate(stationId, boxes) {
    // find all boxes of this station
    let originalBoxes = await Box.find({ stationId: stationId }, { uuid: 1 })
    // get deprecated boxIds
    let diffBoxIds = _.difference(_.map(boxes, 'uuid'), _.map(originalBoxes, 'uuid'))
    // delete deprecated boxes
    await Box.deleteMany({ uuid: { $in: diffBoxIds }})
    // insert box
    await Promise.map(boxes, async item => {
      item = Object.assign({}, item, { stationId: stationId } )
      let box = await Box.findOneAndUpdate({ uuid: item.uuid }, item, { upsert: true, setDefaultsOnInsert: true })
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
    let results = await Box.find({ uuid: { $in: boxIds } }).lean()
    
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
    await Promise.map(tweets, async item => {
      await Tweet.findOneAndUpdate({ index: item.index, box: item.box }, item, { upsert: true, setDefaultsOnInsert: true })
    })
    return 
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
   * return share ticket info
   * @param {string} boxId 
   * @memberof BoxService
   */
  findShareTicket(boxId) {
    return Ticket.find({
      where: {
        boxId: boxId,
        type: 'share'
      },
      sort: [['createdAt', 'DESC']],
      attributes: ['id', 'boxId', 'isAudited'],
      raw: true
    })
  }
	
}

module.exports = new BoxService()
