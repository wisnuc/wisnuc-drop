/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/05 14:36:39 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TweetSchema = Schema({
  uuid: String,
  type: String,
  tweeter: { type: String, required: true },
  ctime: Number,
  comment: String,
  commitId: String,
  parent: Number,
  index: Number,
  box: { type: Schema.Types.ObjectId, ref: 'Box' }
}, {
  timestamps: true
})


TweetSchema.index({ box: -1 })
TweetSchema.index({ botweeterx: 1 })
TweetSchema.index({ updatedAt: -1 })
TweetSchema.index({ uuid: 1 }, { unique: true })
TweetSchema.index({ index: -1 }, { unique: true })

module.exports = mongoose.model('Tweet', TweetSchema)
