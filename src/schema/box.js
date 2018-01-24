/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/24 13:35:06 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')

const BoxSchema = mongoose.Schema({
  uuid: String,
  name: String,
  owner: { type: String, required: true },
  users: Array,
  ctime: Number,
  mtime: Number,
  status: Number,
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})

// BoxSchema.index({ ctime: 1, mtime: -1 })

module.exports = mongoose.model('Box', BoxSchema)
