/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/07 14:42:12 by JianJin Wu       ###   ########.fr       */
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
   * @memberof TweetService
   */
  async create(options) {
    debug(options)
    await Tweet.findOneAndUpdate({ index: options.index, box: options.box }, options, { upsert: true, setDefaultsOnInsert: true }).exec()
    // TODO: seed message to clients
    return 
  }
}

module.exports = new TweetService()
