/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/03/29 15:35:46 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/17 10:57:30 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const TicketUserSchema = new Schema({
    useruuid: String,
    type: String, // pending, reject, resolve
  })

  const TicketSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    status: { type: Number, default: 0 }, // 0 未消费 1 已使用
    creator: { type: String, required: true },
    type: { type: String, required: true }, // invite, bind, share
    stationId: { type: String, required: true },
    boxId: String,
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

  return mongoose.model('Ticket', TicketSchema)
}
