/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/06 14:02:27 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetSchema = Schema({
  uuid: { type: String, required: true },
  type: { type: String, required: true },
  tweeter: { type: String, required: true },
  ctime: Number,
  list: [],
  comment: String,
  commitId: String,
  parent: Number,
  index: { type: Number, required: true },
  box: { type: Schema.Types.ObjectId, ref: 'Box', required: true }
}, {
  timestamps: true
})


TweetSchema.index({ box: -1 })
TweetSchema.index({ botweeterx: 1 })
TweetSchema.index({ updatedAt: -1 })
TweetSchema.index({ uuid: 1 }, { unique: true })
TweetSchema.index({ index: -1 }, { unique: true })

module.exports = mongoose.model('Tweet', TweetSchema)
