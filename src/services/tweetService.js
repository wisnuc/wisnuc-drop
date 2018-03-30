/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 16:21:09 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:tweet')
const { User, Station } = require('../models')
const { Tweet, Box } = require('../schema')
const mqttService = require('./mqttService')
/**
 * This is tweet service.
 * @class TweetService
 */
class TweetService {
  /**
   * 
   * @param {any} options 
   * @memberof TweetService
   */
  async create(options) {
    debug(`options: `, options)
    let box = await Box.findOne({ uuid: options.boxId }).lean()
    if (!box) throw new E.BoxNotExist()
    debug(`box: `, box)
    let result = await Tweet.findOneAndUpdate({ index: options.index, box: box._id }, options, { upsert: true, setDefaultsOnInsert: true })
    // need to seed last tweet to client
    if (!result) {
      
      let userIds = box.users
      let data = await Promise.props({
        station: Station.find({
          where: {
            id: box.stationId
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
        // last tweet
        tweet: Tweet.findOne({ box: box._id }).sort({ index: -1 }).lean()
      })
      let { users, station, tweet } = data
      // assembly data
      box.station = station
      box.tweet = tweet
      box.users = users
      // seed message to client
      mqttService.notice(userIds, box)
      return
    }
     
  }
}

module.exports = new TweetService()
