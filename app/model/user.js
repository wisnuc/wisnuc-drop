/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 10:25:14 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 16:51:01 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    _id: { type: String, default: uuid.v4() },
    status: { type: Number, default: 1 }, // -1: 失效 1: 正常
    unionId: { type: String, required: true },
    nickName: String,
    avatarUrl: String,
    email: String,
    phoneNO: String,
    password: String,
    stations: [{ type: String, ref: 'Station' }],
  }, {
    timestamps: true,
  })

  UserSchema.index({ nickName: 1 })
  UserSchema.index({ unionId: 1 }, { unique: true }) // schema level
  // UserSchema.index({ email: 1 }, { unique: true })
  // UserSchema.index({ phoneNO: 1 }, { unique: true })

  return mongoose.model('User', UserSchema)
}

