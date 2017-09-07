/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   servers.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/25 14:51:48 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/25 14:55:14 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const serverService = require('../../../services/serverService')


// create new server
router.post('/', async (req, res) => {
	try {
		let server = req.body
		let data = await serverService.create(server)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// get one server
router.get('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await serverService.find(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// update server
router.patch('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	},
	body: {
		nickName: Joi.string(),
		avatarUrl: Joi.string()
	}
}), async (req, res) => {
	try {
		let server = Object.assign({}, req.params, req.body)
		let data = await serverService.update(server)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// delete server
router.delete('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.body.id
		let data = await serverService.delete(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// get servers
router.get('/:id/servers', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await serverService.findAllStation(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// get friends
router.get('/:id/friends', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await serverService.findAllFriend(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})


module.exports = router
