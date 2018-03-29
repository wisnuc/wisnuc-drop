/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 11:51:44 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/29 16:23:44 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StationSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  status: { type: Number, default: 1 }, // -1: 失效 1: 正常
  name: { type: String, default: 'WISNUC_' + Date.now() },
  publicKey: String,
  LANIP: String,
  isOnline: Boolean,
  users: { type: [String], index: true }
}, {
  timestamps: true
})

StationSchema.index({ name: 1 })
StationSchema.index({ isOnline: 1 })

module.exports = mongoose.model('Station', StationSchema)
