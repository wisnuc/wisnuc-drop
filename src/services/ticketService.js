/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticketService.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/09 18:11:18 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/30 15:15:11 by JianJin Wu         ###   ########.fr       */
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
				if (!station) throw new Error('not found station')
				// add expire date
				ticket.expireDate = moment(Date.now()).add(1, 'd')
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
				if (!station) throw new Error('not found station')
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
				if (!station) throw new Error('not found station')
				data = await Ticket.create(ticket)
				return {
					id: data.id
				}
		}
	}
	/**
	 * 以 user 查询 ticket
	 * if type = 'invite', 判断 ticket 是否过期
	 * @param {string} ticketId 
	 * @param {string} userId
	 * @returns {object} ticket
	 * @memberof TicketService
	 */
	async findByClient(ticketId, userId) {
		return WisnucDB.transaction(async t => {
			let ticket = await Ticket.find({
				where: {
					id: ticketId,
					status: 0
				},
				transaction: t,
				raw: true
			})
			
			if (!ticket) throw new Error('no such ticket')

			let { stationId, type, expireDate } = ticket

			if (Date.now() > expireDate) 
				throw new Error('ticket already expired')

			if (type === 'invite') {
				let stationUser = await StationUser.find({
					where: {
						userId: userId,
						stationId: stationId
					},
					transaction: t,
					raw: true
				})
				if (stationUser) throw new Error('您已成功注册！')
			} 

			let user = await TicketUser.find({
				where: {
					userId: userId
				},
				transaction: t,
				attributes: ['userId','type'],
				raw: true
			})
			ticket.user = user
			
			return ticket

			// switch (type) {
			// 	case 'bind':
					
			// 		break
			// 	case 'invite':
					
			// 		break
			// 	case 'share':
					
			// 		break
			// 	default:
			// 		break
			// }
			// let data = await Ticket.find({
			// 	where: {
			// 		id: ticketId,
			// 		status: 0
			// 	},
			// 	include: {
			// 		model: TicketUser,
			// 		as: 'users',
			// 		required: false,
			// 		where: {
			// 			userId: userId,
			// 			status: 1
			// 		},
			// 		attributes: ['userId','type']
			// 	}
			// })
			// if (!data) return null
			// let ticket = data.dataValues
			
			// if (data.type == 'invite') {
			// 	if (date.now() > data.expireDate) {
			// 		throw new Error('ticket already expired')
			// 	}
			// } 
			// if (ticket.users.length === 1) {
			// 	let user = ticket.users[0]
			// 	delete ticket.users
			// 	ticket.userType = user.type
			// 	ticket.userId = user.userId
			// }
			// else {
			// 	delete ticket.users
			// 	ticket.userType = null
			// 	ticket.userId = null
			// }
			// return ticket
		})
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
				attributes: ['userId','type'],
				include: {
					model: User,
					attributes: ['nickName', 'avatarUrl', 'unionId']
				}
			}
		})
		_.forEach(tickets, t => {
			let users = t.dataValues.users 
			_.forEach(users, u => {
				let user = u.User.dataValues
				u.dataValues.nickName = user.nickName
				u.dataValues.avatarUrl = user.avatarUrl
				u.dataValues.unionId = user.unionId
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
			attributes: ['userId','type']
		})

		return ticket
	}
	/**
	 * create user
	 * @param {object} args 
	 * @returns {boolean} true
	 * @memberof TicketService
	 */
	createUser(args) {

		let { id, userId, password } = args
		
		return WisnucDB.transaction(async t => {
			let ticket = await TicketUser.find({
				where: {
					ticketId: id,
					userId: userId
				},
				transaction: t
			})

			if (ticket) throw new Error('ticket user already exist')

			return TicketUser.create({
				ticketId: id,
				userId: userId,
				password: password // local user 
			}, { transaction: t })
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

			if (!ticket) throw new Error('no ticket')
		
			// invite, bind, share
			switch (ticket.type) {
				// need to create userStation
				case 'invite':
					// return Promise.props({
					// 	updateTicket: Ticket.update({ status: 1 }, {
					// 		where: {
					// 			id: id,
					// 			stationId: stationId
					// 		},
					// 		transaction: t
					// 	}),
					// 	updateUser: TicketUser.update({ type: type }, {
					// 		where: {
					// 			stationId: stationId
					// 		},
					// 		transaction: t
					// 	})
					// })
					return Ticket.update({status: status}, {
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
				transaction: t,
				raw: true
			})
			// bind 并且 user type 为 resolved
			if (ticket.type === 'bind' && type === 'resolved') {
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
				return TicketUser.update({
					type: type
				}, {
					where: { 
						ticketId: ticketId, 
						userId: userId
					}
				}) 
			}
		})
	}
}

module.exports = new TicketService()
