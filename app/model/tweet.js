/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 16:51:09 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const TweetSchema = new Schema({
    _id: { type: String, default: uuid.v4() },
    type: { type: String, required: true },
    tweeter: { type: String, required: true, ref: 'User' },
    ctime: Number,
    list: [],
    comment: String,
    commitId: String,
    parent: Number,
    index: { type: Number, required: true },
    box: { type: String, required: true, ref: 'Box' },
  }, {
    timestamps: true,
  })

  TweetSchema.index({ box: 1 })
  TweetSchema.index({ tweeter: 1 })
  TweetSchema.index({ updatedAt: -1 })
  TweetSchema.index({ box: 1 }, { index: -1 })

  return mongoose.model('Tweet', TweetSchema)
}

