/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 15:35:46 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/29 16:10:10 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServerSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  status: { type: Number, default: 1 }, // -1: 失效 1: 正常
  WANIP: String,
  LANIP: String,
}, {
  timestamps: true,
})

ServerSchema.index({ WANIP: 1 }, { unique: true })

module.exports = mongoose.model('Server', ServerSchema)
