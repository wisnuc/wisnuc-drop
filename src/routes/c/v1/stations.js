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
		name: Joi.string().required()
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

// store file for client
router.post('/:id/pipe', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), (req, res) => {
	try {
		let server = storeFile.createServer()
		// TODO: consider http timeout, and limit timeout  
		server.parse(req, res)
	}
	catch (err) {
		return res.error(err)
	}
})

// fetch file for client
router.get('/:id/pipe', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let server = fetchFile.createServer()
		await server.run(req, res)
	}
	catch(err) {
		return res.error(err)
	}
})

// GET json transform
router.get('/:id/json', joiValidator({
	params: {
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	let server
	try {
		server = transformJson.createServer()
		await server.run(req, res)
	}
	catch(err) {
		// remove server from transform queue
		console.log(1111, transformJson.map);
		transformJson.removeServer(server.jobId)
		return res.error(err)
	}
})

// POST json transform
router.post('/:id/json', joiValidator({
	params: {                        
		id: Joi.string().guid({ version: ['uuidv4'] }).required()
	}
}), async (req, res) => {
	try {
		let server = transformJson.createServer()
		await server.run(req, res)
	}
	catch(err) {
		return res.error(err)
	}
})

module.exports = router
