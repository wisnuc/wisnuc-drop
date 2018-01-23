/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/23 18:06:06 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')

const BoxSchema = mongoose.Schema({
  uuid: String,
  name: String,
  onwer: { type: String, required: true },
  users: Array,
  ctime: Date,
  mtime: Date,
  status: Number
})

BoxSchema.index({ first: 1, last: -1 })

module.exports = mongoose.model('Box', BoxSchema)
