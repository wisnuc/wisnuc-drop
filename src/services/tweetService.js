/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/09 18:57:30 by JianJin Wu       ###   ########.fr       */
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
    let box = await Box.find({ uuid: options.box }).lean().exec() 
    if (!box) throw new E.BoxNotExist()
    debug(options)
    let result = await Tweet.findOneAndUpdate({ index: options.index, box: box._id }, options, { upsert: true, setDefaultsOnInsert: true }).exec()
    // need to seed last tweet to client
    if (!result) {
      let userIds = box.users
      let data = await Promise.props({
        station: Station.findAll({
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
        tweet: Tweet.find({ box: box._id }).sort({ index: -1 }).lean().exec()
      })
      let { users, station, tweet } = data
      // assembly data
      box.station = station
      box.tweet = tweet
      box.users = users
      // seed message to client
      debug(box, userIds, box)
      mqttService.notice(userIds, box)
      return
    }
     
  }
}

module.exports = new TweetService()
