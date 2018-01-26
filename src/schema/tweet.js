/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/26 16:05:42 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')

const TweetSchema = mongoose.Schema({
  uuid: String,
  type: String,
  tweeter: [],
  ctime: Number,
  comment: String,
  id: String,
  index: { type: Number, index: true },
  deleted: Boolean
}, {
  timestamps: true
})

TweetSchema.index({ index: -1 })

module.exports = mongoose.model('Tweet', TweetSchema)
