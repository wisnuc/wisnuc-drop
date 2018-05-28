/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 16:45:57 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/25 17:12:53 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const Promise = require('bluebird')
const _ = require('lodash')
const moment = require('moment')

const E = require('../lib/error')

/**
 * This is ticket service.
 * @class TicketService
 */
class TicketService extends Service {
  /**
	 * get ticket information
	 * @param {String} userId - ticket uuid
	 * @return {Object} ticket - ticket info
	 */
  async show(userId) {
    const { ctx } = this
    const ticket = await ctx.model.User
      .findOne({ _id: userId })
      .select('-unionId')
      .lean()
    if (!ticket) throw new E.EUSERNOTEXIST()
    return ticket
  }
  /**
	 * create new ticket
	 * @param {Object} ticket - ticket object
   * @return {Object} ticket - ticket info
	 */
  async create(ticket) {
    const { ctx } = this
    const { type } = ticket
    const station = await ctx.model.Station
      .find({ _id: ticket.stationId })
      .lean()
    if (!station) throw new E.StationNotExist()
    let data
    switch (type) {
      case 'invite':
        // add expire date
        ticket.expiredDate = moment(Date.now()).add(1, 'd')
        data = await ctx.model.Ticket.create(ticket)
        return { url: '/v1/tickets/' + data._id }
      case 'bind':
        data = await ctx.model.Ticket.create(ticket)
        return { id: data.id }
      case 'share':
        data = await ctx.model.Ticket.create(ticket)
        return { id: data.id }
      default:
        return
    }
  }
  /**
	 * 以 user 查询 ticket
	 * 1. 用户是否经在此 station 中
	 * 2. 用户是否填写过 ticket，并返回 ticket_user info
	 * 3. 用户是否填写过有效 ticket， 并返回 ticket_user info
	 * @param {String} ticketId - ticket uuid
	 * @param {String} userId - user uuid
	 * @return {Object} ticket
	 * @memberof TicketService
	 */
  async findByClient(ticketId, userId) {
    const { ctx } = this
    const ticket = await ctx.model.Ticket
      .findOne({ _id: ticketId, 'users.user': userId })
      .populate({ path: 'stationId', select: 'name' })
      .populate({ path: 'users', select: 'user type' })
      .lean()

    if (!ticket) throw new E.TicketNotExist()
    const { type, expiredDate, stationId } = ticket
    if (type === 'invite' && Date.now() > expiredDate) throw new E.TicketAlreadyExpired()
    const station = await ctx.model.Station
      .findOne({ _id: stationId, users: { $in: [ userId ] } })
      .lean()
    if (station) throw new E.UserAlreadyExist()
    return ticket
  }
  /**
	 * invite user
	 * 1. 判断 expiredDate 是否过期
	 * 2. 判断 user 是否已在此 ticket 中
	 * 3. 判断 user 是否已经有 fill 过属于 station 的 ticket
	 * 4. create left arrow
	 * @param {String} ticketId - ticket uuid
   * @param {String} userId - user uuid
	 * @memberof TicketService
   * @return {Object} ticket - ticket
	 */
  async inviteUser(ticketId, userId) {
    const { ctx } = this
    const ticket = await ctx.model.Ticket
      .findOne({
        _id: ticketId,
        type: 'invite',
        'users.user': userId,
      })
      .populate({ path: 'stationId', select: 'name' })
      .populate({ path: 'users', select: 'user type' })
      .lean()
    if (!ticket) throw new E.TicketNotExist()
    const { stationId, expiredDate } = ticket
    if (Date.now() > expiredDate) throw new E.TicketAlreadyExpired()
    // let stationUser = await StationUser.find({
    //   where: {
    //     userId: userId,
    //     stationId: stationId
    //   },
    //   transaction: t,
    //   raw: true
    // })
    // if (stationUser) throw new E.UserAlreadyExist()

    // find station`s tickets
    /**
     * 找到该 user 最近一次 fill 的记录
     * 如果该记录为 pending、resolved 则直接返回
     */
    await ctx.model.Ticket
      .find({
        _id: ticketId,
        type: 'invite',
        'users.user': userId,
      })
      .lean()
    // let ticketUser = await TicketUser.find({
    //   where: {
    //     ticketId: ticketIds,
    //     userId: userId,
    //     type: ['pending', 'resolved']
    //   },
    //   transaction: t,
    //   attributes: ['userId', 'type'],
    //   order: 'createdAt DESC',
    //   raw: true
    // })
    // if (ticketUser) throw new E.TicketUserAlreadyExist()

    // create ticket_user adn user_station(left arrow)
    await ctx.model.User.findOneAndUpdate(
      { _id: userId },
      { $set: { stations: stationId } }
    )
    await ctx.model.Ticket.findOneAndUpdate(
      { _id: ticketId },
      { $set: { users: { user: userId } } }
    )
    return ticket
  }
  /**
   * invite user to box
   * 1. 判断 ticket 是否存在、过期
   * 2. 判断 box 是否存在
   * 3. 判断 user 是否存在
   * 4. add this user to ticket_user
   * @param {String} ticketId - ticket uuid
   * @param {String} boxId - box uuid
   * @param {String} userId - user uuid
   * @memberof TicketService
   * @return {Object} box - box
   */
  async shareBox(ticketId, boxId, userId) {
    const { ctx } = this
    const ticket = await ctx.model.Ticket
      .findOne({ _id: ticketId, boxId, type: 'share' })
      .lean()
    if (!ticket) throw new E.TicketNotExist()

    await ctx.model.Ticket.findOneAndUpdate(
      { _id: ticketId },
      { $set: { users: { user: userId, type: ticket.isAudited ? 'pending' : 'resolved' } } }
    )
    return true
  }
}

module.exports = TicketService
