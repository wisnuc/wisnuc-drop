/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/29 17:04:56 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BoxSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  name: String,
  owner: { type: String, required: true },
  stationId: { type: String, required: true },
  users: { type: [String], index: true }, // field level
  tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' }, // last tweet
  ctime: Number,
  mtime: Number
}, {
  timestamps: true
})

BoxSchema.index({ name: 1 })
BoxSchema.index({ owner: 1 })
BoxSchema.index({ stationId: 1 })
BoxSchema.index({ updatedAt: -1 })

module.exports = mongoose.model('Box', BoxSchema)
