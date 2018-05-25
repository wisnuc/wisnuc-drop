/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 15:35:46 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 16:51:16 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ServerSchema = new Schema({
    _id: { type: String, default: uuid.v4() },
    status: { type: Number, default: 1 }, // -1: 失效 1: 正常
    WANIP: String,
    LANIP: String,
  }, {
    timestamps: true,
  })

  ServerSchema.index({ WANIP: 1 }, { unique: true })

  return mongoose.model('Server', ServerSchema)
}

