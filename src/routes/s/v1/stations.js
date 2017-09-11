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

const stationService = require('../../../services/stationService')
const fetchFile = require('../../../services/fetchFile')
const storeFile = require('../../../services/storeFile')
const transformJson = require('../../../services/transformJson')

// create new station
router.post('/', joiValidator({
	body: {
		name: Joi.string(),	// optional
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

// get station
router.get('/:id', joiValidator({
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
		name: Joi.string(),
		userIds: Joi.string()
	}
}), async (req, res) => {
	try {
		let station = Object.assign({}, req.params, req.body)
		let data = await stationService.update(station)
		return res.success(data)
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

// notice cloud to cancel or finish operation 
router.patch('/:id/response/:jobId', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required(),
		jobId: Joi.string().guid({ version: ['uuidv4']}).required()
	},
	body: {
		type: Joi.string().valid(['finished', 'aborted']).required(),
		message: Joi.string().required()
	}
}), (req, res) => {
	try {
		let { id, jobId } = req.params
		let { type, message } = req.body
		let server = storeFile.getServer(jobId)
		if (!server) return res.error('client already disconnect')
		
		if (type === 'finish') {
			storeFile.finish(jobId)
		}else if (type === 'abort') {
			storeFile.abort(jobId)
		}
		return res.success()
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

// response json
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
