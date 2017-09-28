/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/01 16:12:18 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const boxService = require('../../../services/boxService')
const tweetService = require('../../../services/tweetService')
const blackListService = require('../../../services/blackListService')



/**
 * batch operations
  {
    "create":  [array of models to create]
    "update":  [array of models to update]
    "destroy": [array of model ids to destroy]
  }
 */
router.post('/batch', joiValidator({
	body: {
		create: Joi.array(),
		update: Joi.array(),
		destroy: Joi.array()
	}
}), async(req, res) => {
	let { create, update, destroy } = req.body
	let data 
	// create boxes
	if (create) {
		data = await boxService.bulkCreate(create)
	}
	// update boxes
	if (update) {
		data = await boxService.bulkUpdate(update)
	}
	// destroy boxes
	if (destroy) {
		data = await boxService.bulkDestroy(destroy)
	}
	return res.success(data)
})

// create new box
router.post('/', joiValidator({
	body: {
		name: Joi.string().required(),
		ownerId: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async(req, res) => {
	let options = Object.assign({}, req.body)
	let data = await boxService.create(options)
	return res.success(data)
})

// get box
router.get('/:id', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async(req, res) => {
	let id = req.params.id
	let data = await boxService.find(id)
	return res.success(data)
})

// update box
router.patch('/:id', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async(req, res) => {
	let id = req.body.id
	let data = await boxService.update(id)
	return res.success(data)
})

// delete box
router.delete('/:id', joiValidator({
	params: {
		id: Joi.string().guid({version: ['uuidv4']}).required()
	}
}), async(req, res) => {
	let id = req.body.id
	let data = await boxService.delete(id)
	return res.success(data)
})

// get boxes
router.post('/', joiValidator({

}), async(req, res) => {
	try {
		let data = await boxService.findAll()
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
}), async(req, res) => {
	let id = req.body.id
	let data = await boxService.findUser(id)
	return res.success(data)
})



router.post('/:id/tweets', async (req, res) => {
	try {
		let data = await tweetService.insert(req.params.id, req.body)
		res.json({count: data.length})
	} catch(e) {
		res.status(500).json({error:e.message})
	}
})

router.get('/:id/blackList', joiValidator({

}), async(req, res) => {
	try {
		let data = await blackListService.find(req.params.id)
		res.json(data)
	}catch(e) {
		res.status(500).json({error:e.message})
	} 
})

router.post('/:id/blackList', joiValidator({
	
}), async(req, res) => {
	try {
		let insertData = await blackListService.insert(req.params.id, req.body)
		let updateData = await tweetService.updateDeleteList(req.params.id, req.body)
		res.json({})
	}catch(e){
		res.status(500).json({error:e.message})
	}
	
})


module.exports = router
