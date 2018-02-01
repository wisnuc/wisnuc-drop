/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweet.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/01/18 16:05:03 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/01 15:16:01 by JianJin Wu       ###   ########.fr       */
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
  index: { type: Number, index: true },
  box: { type: Schema.Types.ObjectId, ref: 'Box' }
}, {
  timestamps: true
})

TweetSchema.index({ index: -1 })

module.exports = mongoose.model('Tweet', TweetSchema)
