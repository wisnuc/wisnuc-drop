/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 10:25:30 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/16 10:28:03 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppSchema = new Schema({
  uuid: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  version: { type: String, required: true },
  index: { type: Number, required: true }
}, {
  timestamps: true
})

AppSchema.index({ version: 1 })
AppSchema.index({ index: 1 })

module.exports = mongoose.model('App', AppSchema)
