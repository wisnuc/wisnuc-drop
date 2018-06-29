/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 15:35:46 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 15:02:18 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const uuid = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketUserSchema = new Schema({
  _id: { type: String, default: uuid.v4() },
  user: { type: String, ref: 'User' },
  type: { type: String, default: 'pending' }, // pending, reject, resolve
}, {
  timestamps: true,
})

const TicketSchema = new Schema({
  _id: { type: String, default: uuid.v4() },
  status: { type: Number, default: 0 }, // 0 未消费 1 已使用
  creator: { type: String, required: true, ref: 'User' },
  type: { type: String, required: true }, // invite, bind, share
  stationId: { type: String, required: true, ref: 'Station' },
  box: { type: String, required: true, ref: 'Box' },
  boxId: { type: String, required: true, ref: 'Box' },
  isAudited: Number,
  expiredDate: Date,
  data: String,
  users: [ TicketUserSchema ],
}, {
  timestamps: true,
})

TicketSchema.index({ creator: 1 })
TicketSchema.index({ stationId: 1 })
TicketSchema.index({ boxId: 1 })

module.exports = mongoose.model('Ticket', TicketSchema)
