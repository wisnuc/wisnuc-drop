/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxService.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/12 14:09:14 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 16:56:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const debug = require('debug')('app:box')
const _ = require('lodash')
const { Ticket, Box, Tweet } = require('../models')

/**
 * This is box service.
 * @class BoxService
 */
class BoxService {
  /**
	 * create box
	 * @param {Object} box - box object
	 * @memberof BoxService
   * @return {Object} box
	 */
  async create(box) {
    return Box.findOneAndUpdate({ _id: box.uuid }, box, { upsert: true })
  }
  /**
	 * get box
	 * @param {string} boxId - box uuid
	 * @memberof BoxService
   * @return {Object} box
	 */
  async find(boxId) {
    const box = await Box
      .findOne({ _id: boxId })
      .populate({ path: 'users.user', select: 'nickName avatarUrl status' })
      .lean()
    if (!box) throw new E.BoxNotExist()
    const { users } = box.users
    if (!users) throw new E.UserNotExist()
    return box
  }
  /**
	 * update box
	 * @param {Object} box - box object
	 * @memberof BoxService
   * @return {Boolean} boolean - true or false
	 */
  update(box) {
    return Box.findOneAndUpdate({ _id: box.uuid }, box)
  }
  /**
	 * delete box
	 * @param {Object} boxId - box uuid
	 * @memberof BoxService
   * @return {Boolean} boolean - true or false
	 */
  delete(boxId) {
    return Box.deleteOne({ _id: boxId })
  }
  /**
	 * get boxes
	 * @param {Object} userId - user uuid
	 * @memberof BoxService
   * @return {Array} boxes
	 */
  async findAll(userId) {
    const boxes = await Box
      .find({ users: { $in: [ userId ] } })
      .populate({ path: 'users', select: '-unionId' })
      .populate({ path: 'station', select: '-publicKey' })
      .populate({ path: 'tweet', options: { sort: '-index' } })
      .lean()
    return boxes
  }
  /**
	 * create boxes
   * 1. if boxes exist, delete deprecated boxes and create tweets.
   * 2. if boxes don't exist, create boxes && tweets && ticket.
   * @param {String} stationId - station uuid
	 * @param {Array} boxes - box list
	 * @memberof BoxService
	 */
  async bulkCreate(stationId, boxes) {
    // find all boxes of this station
    const originalBoxes = await Box
      .find({ stationId })
      .select('_id')
      .lean()
    // get deprecated boxIds
    const diffBoxIds = _.difference(_.map(boxes, '_id'), _.map(originalBoxes, '_id'))
    // delete deprecated boxes
    await Box.deleteMany({ uuid: { $in: diffBoxIds } })
    // insert box
    await Promise.map(boxes, async item => {
      item = Object.assign({}, item, { stationId })
      const box = await Box.findOneAndUpdate({ uuid: item.uuid }, item, { upsert: true, setDefaultsOnInsert: true })
      // if the box is newly created, create box's ticket
      if (!box) {
        const ticket = {
          creator: item.owner,
          type: 'share',
          stationId,
          boxId: item.uuid,
          isAudited: 0, // don't audit
        }

        await Ticket.findOneAndUpdate(
          {
            type: ticket.type,
            creator: ticket.creator,
            stationId: ticket.stationId,
          }, ticket, { upsert: true, setDefaultsOnInsert: true })
      }
    })
    const boxIds = _.map(boxes, 'uuid')
    const results = await Box
      .find({ uuid: { $in: boxIds } })
      .lean()

    const tweets = []
    // add box ObejectId to tweet data
    for (const box of boxes) {
      if (box.tweet) {
        for (const result of results) {
          if (box.uuid === result.uuid) {
            const tweet = Object.assign({}, box.tweet, { box: result._id })
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
   * return share ticket info
   * @param {String} boxId - box uuid
   * @memberof BoxService
   * @return {Object} ticket
   */
  findShareTicket(boxId) {
    return Ticket
      .find({ boxId, type: 'share' })
      .select('boxId isAudited')
      .sort('-createdAt')
      .lean()
  }
}

module.exports = new BoxService()
