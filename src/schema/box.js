/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/05 14:37:34 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')

const BoxSchema = mongoose.Schema({
  uuid: String,
  name: String,
  owner: { type: String, required: true },
  stationId: { type: String, required: true },
  users: { type: [String], index: true }, // field level
  ctime: Number,
  mtime: Number
}, {
  timestamps: true
})

BoxSchema.index({ name: 1 })
BoxSchema.index({ owner: 1 })
BoxSchema.index({ stationId: 1 })
BoxSchema.index({ updatedAt: -1 })
BoxSchema.index({ uuid: 1 }, { unique: true }) // schema level


module.exports = mongoose.model('Box', BoxSchema)
