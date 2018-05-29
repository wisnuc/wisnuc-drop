/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 16:07:17 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const BoxSchema = new Schema({
    _id: { type: String, default: uuid.v4() },
    name: String,
    owner: { type: String, required: true, ref: 'User' },
    stationId: { type: String, required: true, ref: 'Station' },
    users: [{ type: String, ref: 'User' }], // field level
    tweet: { type: String, ref: 'Tweet' }, // last tweet
    ctime: Number,
    mtime: Number,
  }, {
    timestamps: true,
  })

  BoxSchema.index({ name: 1 })
  BoxSchema.index({ owner: 1 })
  BoxSchema.index({ stationId: 1 })
  BoxSchema.index({ updatedAt: -1 })

  return mongoose.model('Box', BoxSchema)
}

