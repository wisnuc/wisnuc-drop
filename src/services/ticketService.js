/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticketService.js                                   ::      ::    ::   */
/*                                                    : :         :     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         #  :       #        */
/*                                                #####   #           */
/*   Created: 2017/11/10 11:34:45 by JianJin Wu        ##    ##             */
/*   Updated: 2018/02/24 16:54:49 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const _ = require('lodash')
const moment = require('moment')
const {
	Ticket,
  TicketUser,
  User,
  UserStation,
  Station,
  StationUser,
  WisnucDB
} = require('../models')

const { Box } = require('../schema')
/**
 * This is ticket service.
 * @class TicketService
 */
class TicketService {

	/**
	 * create new ticket
	 * if type === invite , return url
	 * @param {object} ticket 
	 * @returns {object} ticket
	 */
  async create(ticket) {
    let station, data
    switch (ticket.type) {
    case 'invite':
      station = await Station.find({
        where: {
          id: ticket.stationId
        },
        raw: true
      })
      if (!station) throw new E.StationNotExist()
      // add expire date
      ticket.expiredDate = moment(Date.now()).add(1, 'd')
      data = await Ticket.create(ticket)
      return {
        url: '/v1/tickets/' + data.id
      }
    case 'bind':
      station = await Station.find({
        where: {
          id: ticket.stationId
        },
        raw: true
      })
      if (!station) throw new E.StationNotExist()
      data = await Ticket.create(ticket)
      return {
        id: data.id
      }
    case 'share':
      station = await Station.find({
        where: {
          id: ticket.stationId
        },
        raw: true
      })
      if (!station) throw new E.StationNotExist()
      data = await Ticket.create(ticket)
      return {
        id: data.id
      }
    }
  }
	/**
	 * 以 user 查询 ticket
	 * 1. 用户是否经在此 station 中
	 * 2. 用户是否填写过 ticket，并返回 ticket_user info
	 * 3. 用户是否填写过有效 ticket， 并返回 ticket_user info
	 * @param {string} ticketId 
	 * @param {string} userId
	 * @returns {object} ticket
	 * @memberof TicketService
	 */
  async findByClient(ticketId, userId) {
    return WisnucDB.transaction(async t => {
      let ticket = await Ticket.find({
        where: {
          id: ticketId
        },
        include: [
          {
            model: User,
            as: 'creatorInfo',
            attributes: ['id', 'nickName', 'avatarUrl']
          },
          {
            model: Station,
            as: 'station',
            attributes: ['id', 'name']
          }
        ],
        transaction: t
      })
      if (!ticket) throw new E.TicketNotExist()
      let { type, expiredDate, stationId } = ticket
      if (type == 'invite' && Date.now() > expiredDate) throw new E.TicketAlreadyExpired()
      let stationUser = await StationUser.find({
        where: {
          stationId: stationId,
          userId: userId
        },
        transaction: t,
        raw: true
      })
      if (stationUser) throw new E.UserAlreadyExist()
      let tickets = await Ticket.findAll({
        where: {
          stationId: stationId,
          type: 'invite'
        },
        transaction: t,
        attributes: ['id'],
        raw: true
      })
      let ticketIds = _.map(tickets, 'id')
      let user = await TicketUser.find({
        where: {
          ticketId: ticketIds,
          userId: userId
        },
        transaction: t,
        attributes: ['userId', 'ticketId', 'type'],
        order: 'createdAt DESC',
        raw: true
      })
      // add user
      ticket.dataValues.user = user
      return ticket
    })
  }
	/**
	 * invite user
	 * 1. 判断 expiredDate 是否过期
	 * 2. 判断 user 是否已在此 ticket 中
	 * 3. 判断 user 是否已经有 fill 过属于 station 的 ticket 
	 * 4. create left arrow
	 * @param {object} args 
	 * @memberof TicketService
	 */
  inviteUser(args) {
    let { ticketId, userId } = args
    return WisnucDB.transaction(async t => {
      let ticket = await Ticket.find({
        where: {
          id: ticketId,
          type: 'invite'
        },
        transaction: t,
        raw: true
      })
      if (!ticket) throw new E.TicketNotExist()
      let { stationId, expiredDate } = ticket
      if (Date.now() > expiredDate) throw new E.TicketAlreadyExpired()
      let stationUser = await StationUser.find({
        where: {
          userId: userId,
          stationId: stationId
        },
        transaction: t,
        raw: true
      })
      if (stationUser) throw new E.UserAlreadyExist()
      // find station`s tickets
      let tickets = await Ticket.findAll({
        where: {
          stationId: stationId,
          type: 'invite'
        },
        transaction: t,
        attributes: ['id'],
        raw: true
      })
      let ticketIds = _.map(tickets, 'id')
			/**
			 * 找到该 user 最近一次 fill 的记录
			 * 如果该记录为 pending、resolved 则直接返回
			 */
      let ticketUser = await TicketUser.find({
        where: {
          ticketId: ticketIds,
          userId: userId,
          type: ['pending', 'resolved']
        },
        transaction: t,
        attributes: ['userId', 'type'],
        order: 'createdAt DESC',
        raw: true
      })
      if (ticketUser) throw new E.TicketUserAlreadyExist()
      // create ticket_user adn user_station(left arrow)
      let result = await Promise.props({
        // create left user_station arrow
        createLeftArrow: UserStation.findOrCreate({
          where: {
            userId: userId,
            stationId: stationId
          },
          defaults: {
            userId: userId,
            stationId: stationId
          },
          transaction: t,
          raw: true
        }),
        // create ticket_user
        createTicketUser: await TicketUser.findOrCreate({
          where: {
            ticketId: ticketId,
            userId: userId
          },
          defaults: args,
          transaction: t,
          attributes: ['userId', 'type'],
          raw: true
        }).spread(newObj => newObj)
      })
      // add user property
      ticket.user = result.createTicketUser
      return ticket
    })
  }
  /**
   * invite user to box
   * 1. 判断 ticket 是否存在、过期
   * 2. 判断 box 是否存在
   * 3. 判断 user 是否存在
   * 4. add this user to ticket_user
   * @param {object} args 
   * @memberof TicketService
   */
  async shareBox(args) {
    let { ticketId, boxId, userId } = args
    let ticket = await Ticket.find({
      where: {
        id: ticketId,
        boxId: boxId,
        type: 'share'
      },
      attributes: ['isAudited'],
      raw: true
    })
    if (!ticket) throw new E.TicketNotExist()
    await TicketUser.findOrCreate({
      where: {
        ticketId: ticketId,
        userId: userId
      },
      defaults: {
        ticketId: ticketId,
        userId: userId,
        type: ticket.isAudited ? 'pending' : 'resolved'
      },
      attributes: ['userId', 'type'],
      raw: true
    })
    return true
  }
	/**
	 * 以 user 查询 ticket
	 * @param {string} ticketId 
	 * @param {string} stationId
	 * @returns {object} ticket
	 * @memberof TicketService
	 */
  async findByStation(ticketId, stationId) {
    let props = await Promise.props({
      ticket: Ticket.find({
        where: {
          id: ticketId,
          stationId: stationId
        },
        raw: true
      }),
      users: User.findAll({
        include: {
          model: TicketUser,
          where: {
            ticketId: ticketId
          },
          attributes: []
        },
        attributes: ['id', 'nickName', 'avatarUrl', 'unionId']
      })
    })

    if (props.ticket) {
      props.ticket.users = props.users
    }

    return props.ticket
  }
	/**
	 * find all tickets by params
	 * @param {object} params
	 * @returns {object} tickets
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
	 * @param {any} ticketId 
	 * @memberof TicketService
	 */
  findAllUser(ticketId) {
    return User.findAll({
      include: {
        model: TicketUser,
        where: {
          ticketId: ticketId
        },
        attributes: []
      }
    })
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
