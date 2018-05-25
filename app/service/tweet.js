/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 18:11:30 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service

const E = require('../lib/error')

/**
 * This is tweet service.
 * @class TweetService
 */
class TweetService extends Service {
  /**
   * create tweets
   * @param {Array} tweets - tweet list
   * @memberof TweetService
   */
  async create(tweets) {
    const { ctx } = this
    const box = await ctx.model.Box
      .findOne({ _id: tweets.boxId })
      .populate({ path: 'station', select: 'name isOnline LANIP' })
      .populate({ path: 'users', select: 'nickName avatarUrl status' })
      .populate({ path: 'tweet', options: { sort: '-index' } })
      .lean()
    if (!box) throw new E.BoxNotExist()
    const result = await ctx.model.Box.Tweet
      .findOneAndUpdate({ index: tweets.index, box: box._id }, tweets, { upsert: true, setDefaultsOnInsert: true })
    // need to seed last tweet to client
    if (!result) {
      const userIds = box.users
      // seed message to client
      ctx.mqtt.notice(userIds, box)
      return
    }
  }
}

module.exports = TweetService
