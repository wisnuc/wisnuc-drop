/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweetService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/30 11:12:53 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/01 16:32:20 by JianJin Wu       ###   ########.fr       */
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
  create(options) {
    let tweet = new Tweet(options)
    tweet.save()
    return tweet 
  }
}

module.exports = new TweetService()
