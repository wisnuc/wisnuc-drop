/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tickets.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/28 13:25:27 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/09 17:13:15 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const jwt = require('../../../middlewares/jwt')
const ticketService = require('../../../services/ticketService')


// get ticket
router.get('/:id', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let user = req.auth.user
		let data = await ticketService.findByClient(id, user.id)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})

// invite user for mini program
router.post('/:id/invite', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		let user = req.auth.user
		let args = {
			ticketId: req.params.id,
			userId: user.id
		}
		let data = await ticketService.inviteUser(args)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})

// get all tickets
router.get('/', joiValidator({
	query: {
		creator: Joi.string().guid({version: ['uuidv4']}),
		stationId: Joi.string().guid({version: ['uuidv4']}),
		status: Joi.number().valid([0,1])
	}
}), async (req, res) => {
	try {
		let creator = req.query.creator
		let stationId = req.query.stationId
		let params = {}
		if (creator) {
			params.creator = creator
		}
		if (stationId) {
			params.creator = creator
		}
		let data = await ticketService.findAll(params)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})

// fill ticket (except invite)
router.post('/:id/users', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		let user = req.auth.user
		let args = {
			ticketId: req.params.id,
			userId: user.id
		}
		let data = await ticketService.createUser(args)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})

// get user
router.get('/:id/users/:userId', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required(),
		userId: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let userId = req.params.userId
		let data = await ticketService.findUser(id, userId)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})

// get users
router.get('/:id/users', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await ticketService.findAllUser(id)
		return res.success(data)
	} 
	catch(err) {
		return res.error(err)
	}
})


module.exports = router
