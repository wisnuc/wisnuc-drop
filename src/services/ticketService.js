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
	 * @param {string} ticketId 
	 * @param {string} userId
	 * @returns {object} ticket
	 * @memberof TicketService
	 */
	async findByClient(ticketId, userId) {
		
		let ticket = await Ticket.find({
			where: {
				id: ticketId
			},
			raw: true
		})
		
		if (!ticket) 
			throw new Error('no such ticket')

		let { type, expiredDate } = ticket
		if (type == 'invite' && Date.now() > expiredDate) 
			throw new Error('ticket already expired')

		let user = await TicketUser.find({
			where: {
				ticketId: ticketId,
				userId: userId
			},
			attributes: ['userId','type'],
			raw: true
		})

		ticket.user = user
		return ticket
		
	}
	/**
	 * invite user
	 * 1. 判断 expiredDate 是否过期
	 * 2. 判断 user 是否已注册
	 * 3. 判断 user 是否存在其他有效的 ticket 中
	 * @param {object} args 
	 * @returns 
	 * @memberof TicketService
	 */
	inviteUser(args) {

		let { ticketId, userId, password } = args

		return WisnucDB.transaction(async t => {
			
			let ticket = await Ticket.find({
				where: {
					id: ticketId,
					type: 'invite'
				},
				transaction: t,
				raw: true
			})

			if (!ticket) throw new Error('no such ticket')

			let { stationId, type, expiredDate } = ticket

			if (Date.now() > expiredDate)
				throw new Error('ticket already expired')

			let stationUser = await StationUser.find({
				where: {
					userId: userId,
					stationId: stationId
				},
				transaction: t,
				raw: true
			})
			if (stationUser) throw new Error('您已成功注册！')
			
			// 排除有效内，状态为 pending, resolved
			let validTicket = await Ticket.find({
				where: {
					stationId: stationId,
					type: 'invite',
					expiredDate: { $gt: Date.now() }, 
				},
				include: {
					model: TicketUser,
					where: {
						userId: userId,
						type: ['pending', 'resolved'] // pending, resolved
					},
					attributes: ['userId']
				},
				attributes: ['id'],
				transaction: t,
				raw: true
			})

			if (validTicket) throw new Error('您已提交过申请，请等待管理员审核结果！')
			
			let user = await TicketUser.findOrCreate({
				where: {
					ticketId: ticketId,
					userId: userId
				},
				defaults: args,
				transaction: t,
				attributes: ['userId', 'type'],
				raw: true
			}).spread(newObj => newObj)

			// let user = await TicketUser.find({
			// 	where: {
			// 		userId: userId
			// 	},
			// 	include: {
			// 		model: Ticket,
			// 		required: false,
			// 		where: {
			// 			id: ticketId,
			// 			type: 'invite'
			// 		}
			// 	},
			// 	transaction: t,
			// 	attributes: ['userId', 'type'],
			// 	raw: true
			// })
			ticket.user = user
			return ticket
			
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
				attributes: ['userId', 'type'],
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
			
			if (!ticket) throw new Error('no such ticket')

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
					if (Date.now() > ticket.expiredDate) throw new Error('ticket 已失效！')
					
					return TicketUser.update({
						type: type
					}, {
						where: {
							ticketId: ticketId,
							userId: userId
						},
						transaction: t
					})

				default:
					return 'TODO'
			}

		})
	}
}

module.exports = new TicketService()
