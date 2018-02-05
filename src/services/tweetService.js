/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/05 17:41:12 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app:tweet')

const { Tweet, Box } = require('../schema')

/**
 * This is tweet service.
 * @class TweetService
 */
class TweetService {
  /**
   * 
   * @param {any} options 
   * @returns 
   * @memberof TweetService
   */
  async create(options) {
    await Tweet.findOneAndUpdate({ index: options.index, box: options.box }, options, { upsert: true, setDefaultsOnInsert: true }).exec()
    // TODO: seed message to clients
    return 
  }
}

module.exports = new TweetService()
