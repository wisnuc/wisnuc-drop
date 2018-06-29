/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/29 16:34:45 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 16:50:45 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const _ = require('lodash')
const moment = require('moment')
const {
	Ticket,
  User,
  Station,
} = require('../models')

/**
 * This is ticket service.
 * @class TicketService
 */
class TicketService {
	/**
	 * create new ticket
	 * if type === invite , return url
	 * @param {Object} ticket 
	 * @returns {Object} ticket
	 */
  async create(ticket) {
    const { type } = ticket
    const station = await Station
      .find({ _id: ticket.stationId })
      .lean()
    if (!station) throw new E.StationNotExist()
    let data
    switch (type) {
    case 'invite':
      // add expire date
      ticket.expiredDate = moment(Date.now()).add(1, 'd')
      data = await Ticket.create(ticket)
      return { url: '/v1/tickets/' + data._id }
    case 'bind':
      data = await Ticket.create(ticket)
      return { id: data.id }
    case 'share':
      data = await Ticket.create(ticket)
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
    const ticket = await Ticket
      .findOne({ _id: ticketId, 'users.user': userId })
      .populate({ path: 'stationId', select: 'name' })
      .populate({ path: 'users', select: 'user type' })
      .lean()

    if (!ticket) throw new E.TicketNotExist()
    const { type, expiredDate, stationId } = ticket
    if (type === 'invite' && Date.now() > expiredDate) throw new E.TicketAlreadyExpired()
    const station = await Station
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
    const ticket = await Ticket
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
    await Ticket
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
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { stations: stationId } }
    )
    await Ticket.findOneAndUpdate(
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
    const ticket = await Ticket
      .findOne({ _id: ticketId, boxId, type: 'share' })
      .lean()
    if (!ticket) throw new E.TicketNotExist()

    await Ticket.findOneAndUpdate(
      { _id: ticketId },
      { $set: { users: { user: userId, type: ticket.isAudited ? 'pending' : 'resolved' } } }
    )
    return true
  }
	/**
	 * 以 station 查询 ticket
	 * @param {String} ticketId 
	 * @param {String} stationId
	 * @returns {Object} ticket
	 * @memberof TicketService
	 */
  async findByStation(ticketId, stationId) {
    return Ticket
      .findOne({ _id: ticketId, 'stationId': stationId })
      .populate({ path: 'stationId', select: 'name' })
      .populate({ path: 'users', select: 'user type' })
      .lean()
  }
	/**
	 * find all tickets by params
	 * @param {Object} params
	 * @returns {Object} tickets
	 */
  async findAll(params) {
    let tickets = await Ticket.findAll({
      where: params,
      include: {
        model: TicketUser,
        as: 'users',
        attributes: ['userId', 'type'],
        include: {
          model: User,
          attributes: ['nickName', 'avatarUrl']
        }
      }
    })
    _.forEach(tickets, t => {
      let users = t.dataValues.users
      _.forEach(users, u => {
        let user = u.User.dataValues
        u.dataValues.nickName = user.nickName
        u.dataValues.avatarUrl = user.avatarUrl
        delete u.User.dataValues
      })
    })
    return tickets
  }
	/**
	 * find user
	 * @param {string} id 
	 * @returns {object} ticket
	 * @memberof TicketService
	 */
  async findUser(id, userId) {
    let ticket = await TicketUser.find({
      where: {
        ticketId: id,
        userId: userId
      },
      attributes: ['userId', 'type']
    })

    return ticket
  }
	/**
	 * create user
	 * @param {object} args 
	 * @memberof TicketService
	 */
  createUser(args) {
    let { ticketId, userId } = args
    return WisnucDB.transaction(async t => {

      let ticket = await Ticket.find({
        where: {
          id: ticketId,
          status: 0
        },
        attributes: ['id', 'type', 'expiredDate'],
        transaction: t,
        raw: true
      })

      if (!ticket) throw new E.TicketNotExist()

      return TicketUser.findOrCreate({
        where: {
          ticketId: ticketId,
          userId: userId
        },
        transaction: t
      }).spread(newObj => newObj)
    })
  }
	/**
	 * confirm operation
	 * ticket status modify to used.
	 * users of ticket 
	 * @param {object} args 
	 * @returns {boolean} true
	 * @memberof TicketService
	 */
  async update(args) {
    let { id, stationId, status } = args
    return WisnucDB.transaction(async t => {
      let ticket = await Ticket.find({
        where: {
          id: id,
          stationId: stationId
        },
        raw: true,
        transaction: t
      })

      if (!ticket) throw new E.TicketNotExist()

      // invite, bind, share
      switch (ticket.type) {
      // need to create userStation
      case 'invite':
        return Ticket.update({ status: status }, {
          where: {
            id: id,
            stationId: stationId
          },
          transaction: t
        })
      case 'bind':
        // move to updateUser
        return
      case 'share':
        return
      }
    })
  }
	/**
	 * get users
	 * @param {Object} conditions 
	 * @memberof TicketService
	 */
  findAllUser(conditions) {
    return Ticket
      .find(conditions)
      .populate({ path: 'users', select: 'user type' })
      .lean()
  }
	/**
	 * update user or users
	 * @param {string} ticketId 
	 * @param {string} type
	 * @param {string} userId
	 * @returns {boolean} true
	 * @memberof TicketService
	 */
  updateUser(ticketId, type, userId) {

    return WisnucDB.transaction(async t => {
      let ticket = await Ticket.find({
        where: {
          id: ticketId
        },
        attributes: ['id', 'stationId', 'type', 'expiredDate'],
        transaction: t,
        raw: true
      })

      let ticketType = ticket.type

      switch (ticketType) {

      case 'bind':
        // bind 并且 user type 为 resolved
        if (type === 'resolved') {
          return Promise.props({
            updateUserType: TicketUser.update({
              type: type
            }, {
              where: {
                ticketId: ticketId,
                userId: userId
              },
              transaction: t
            }),
            updateTicketType: Ticket.update({ status: 1 }, {
              where: {
                id: ticketId
              },
              transaction: t
            }),
            // find or create
            createUserStation: UserStation.findOrCreate({
              where: {
                userId: userId,
                stationId: ticket.stationId
              },
              transaction: t
            })
          })
        }
        else {
          // update user type
          return TicketUser.update({
            type: type
          }, {
            where: {
              ticketId: ticketId,
              userId: userId
            },
            transaction: t
          })
        } 

      case 'invite':
        if (Date.now() > ticket.expiredDate)
          throw new E.TicketAlreadyExpired()

        return TicketUser.update({
          type: type
        }, {
          where: {
            ticketId: ticketId,
            userId: userId
          },
          transaction: t
        })
      }

    })
  }
}

module.exports = new TicketService()
