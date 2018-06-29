/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 16:53:41 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:tweet')
const { Tweet, Box } = require('../models')
const mqttService = require('./mqttService')
/**
 * This is tweet service.
 * @class TweetService
 */
class TweetService {
  /**
   * create tweets
   * @param {Array} tweets - tweet list
   * @memberof TweetService
   */
  async create(tweets) {
    const box = await Box
      .findOne({ _id: tweets.boxId })
      .populate({ path: 'station', select: 'name isOnline LANIP' })
      .populate({ path: 'users', select: 'nickName avatarUrl status' })
      .populate({ path: 'tweet', options: { sort: '-index' } })
      .lean()
    if (!box) throw new E.BoxNotExist()
    const result = await Tweet
      .findOneAndUpdate({ index: tweets.index, box: box._id }, tweets, { upsert: true, setDefaultsOnInsert: true })
    // need to seed last tweet to client
    if (!result) {
      const userIds = box.users
      // seed message to client
      mqttService.notice(userIds, box)
    }
  }
}

module.exports = new TweetService()
