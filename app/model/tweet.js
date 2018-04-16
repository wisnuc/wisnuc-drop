/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  tweeter: { type: String, required: true },
  ctime: Number,
  list: [],
  comment: String,
  commitId: String,
  parent: Number,
  index: { type: Number, required: true },
  box: { type: Schema.Types.ObjectId, required: true, ref: 'Box' },
}, {
  timestamps: true,
})

TweetSchema.index({ box: 1 })
TweetSchema.index({ tweeter: 1 })
TweetSchema.index({ updatedAt: -1 })
TweetSchema.index({ box: 1 }, { index: -1 })

module.exports = mongoose.model('Tweet', TweetSchema)
