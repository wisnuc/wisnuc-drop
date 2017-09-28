/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:10:47 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/09 15:23:44 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const jwt = require('../../../middlewares/jwt')
const stationService = require('../../../services/stationService')
const fetchFile = require('../../../services/fetchFile')
const storeFile = require('../../../services/storeFile')
const transformJson = require('../../../services/transformJson')

// create new station, no token
router.post('/', joiValidator({
	body: {
		name: Joi.string().max(12).truncate(),	// optional
		LANIP: Joi.string(), 									  // optional
		publicKey: Joi.string().required()
	}
}), async (req, res) => {
	try {
		let station = req.body
		let data = await stationService.create(station)
		return res.success({
			id: data.id
		})
	}
	catch (err) {
		return res.error(err)
	}
})

// authorization
router.use('*', jwt.sAuth)

// get station
router.get('/:id',  joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await stationService.find(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// update station
router.patch('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	},
	body: {
		name: Joi.string().max(12).truncate(),	// optional
		LANIP: Joi.string(), 									  // optional
		userIds: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }))
	}
}), async (req, res) => {
	try {
		// update station
		if (req.body.name || req.body.LANIP) {
			let station = Object.assign({}, {
				id: req.params.id,
				name: req.body.name,
				LANIP: req.body.LANIP
			})
			await stationService.update(station)
		}
		// update users
		if (req.body.userIds && req.body.userIds.length !== 0) {
			await stationService.updateUsers(req.params.id, req.body.userIds)
		}
		return res.success()
	}
	catch (err) {
		return res.error(err)
	}
})

// delete station
router.delete('/:id', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	let id = req.params.id
	let data = await stationService.delete(id)
	return res.success(data)
})

// get users
router.get('/:id/users', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let id = req.params.id
		let data = await stationService.findUsers(id)
		return res.success(data)
	}
	catch (err) {
		return res.error(err)
	}
})

// store file
router.get('/:id/response/:jobId', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), (req, res) => {
	try {
		storeFile.request(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})
// response store file result to client  
router.post('/:id/response/:jobId/pipe/store', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4']}).required()
	},
	body: {
		error: Joi.any(),
		data: Joi.any()
	}
}), (req, res) => {
	try {
		// response
		storeFile.response(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})

// fetch file
router.post('/:id/response/:jobId', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		fetchFile.request(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})

// response fetch error to client 
router.post('/:id/response/:jobId/pipe/fetch', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4']}).required()
	},
	body: {
		message: Joi.string().required(),
		code: Joi.number().required()
	}
}), async (req, res) => {
	try {
		// response
		fetchFile.response(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})

// response json error to client
router.post('/:id/response/:jobId/json', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4']}).required()
	}
}), async (req, res) => {
	try {
		transformJson.request(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})


module.exports = router
