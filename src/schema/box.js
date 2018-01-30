/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/30 10:52:53 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')

const BoxSchema = mongoose.Schema({
  uuid: String,
  name: String,
  owner: { type: String, required: true },
  stationId: { type: String, required: true },
  users: [String],
  ctime: Number,
  mtime: Number,
  status: Number
}, {
  timestamps: true
})

BoxSchema.index({ createdAt: -1 }) // 降序索引

module.exports = mongoose.model('Box', BoxSchema)
