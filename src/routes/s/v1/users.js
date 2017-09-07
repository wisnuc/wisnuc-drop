/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:07:44 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const userService = require('../../../services/userService')


// get user
router.get('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await userService.find(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// update user
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
		let user = Object.assign({}, req.params, req.body)
		let data = await userService.update(user)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// delete user
router.delete('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.body.id
		let data = await userService.delete(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// get stations
router.get('/:id/stations', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await userService.findAllStation(id)
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
		let data = await userService.findAllFriend(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})


module.exports = router
