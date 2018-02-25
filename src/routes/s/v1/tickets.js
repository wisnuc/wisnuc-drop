/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tickets.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/28 13:25:27 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/25 11:45:04 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const ticketService = require('../../../services/ticketService')


// create ticket
router.post('/', joiValidator({
  body: {
    type: Joi.string().valid(['invite', 'bind', 'share']).required(),
    stationId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    creator: Joi.string(), // optional
    data: Joi.string() 		 // optional
  }
}), async (req, res) => {
  try {
    let data = await ticketService.create(req.body)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// get ticket
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let station = req.auth.station
    let data = await ticketService.findByStation(id, station.id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// update ticket
router.patch('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    status: Joi.number().valid([-1, 1]).required(), // -1: deleted, 1: finished
    userId: Joi.string().guid({ version: ['uuidv4'] })
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let status = req.body.status
    let station = req.auth.station
    let args = {
      id: id,
      stationId: station.id,
      status: status
    }
    let data = await ticketService.update(args)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/tickets:
 *   get:
 *     summary: return tickets
 *     tags:
 *     - /s/tickets
 *     parameters:
 *     - name: creator
 *       in: query
 *       required: false
 *       description: ticket uuid
 *       type: string
 *     - name: stationId
 *       in: query
 *       required: false
 *       description: station uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items: 
 *             properties:
 *               id:
 *                 type: string
 *                 example: 00000071-e843-4cdb-a279-c7ce802558ec
 *               creator:
 *                 type: string
 *                 example: f7b71a94-6827-4532-a8f2-5a9ee454355b
 *               type:
 *                 type: string
 *                 example: bind
 *               stationId:
 *                 type: string
 *                 example: 4ea6038b-1003-4cc6-ac34-51d83e3f24da
 *               expiredDate:
 *                 type: string
 *                 format: dateTime
 *                 example: null
 *               status:
 *                 type: number
 *                 example: 0
 *               users:
 *                 type: array
 *                 items:
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: c4d249dd-ed57-4655-9497-2a93ae3af1d0
 *                     type:
 *                       type: string
 *                       example: pending
 *                     nickName:
 *                       type: string
 *                       example: Jianjin Wu
 *                     avatarUrl:
 *                       type: string
 *                       example: http://wx.qlogo.cn
 */
router.get('/', joiValidator({
  query: {
    creator: Joi.string().guid({ version: ['uuidv4'] }),
    stationId: Joi.string().guid({ version: ['uuidv4'] })
    // status: Joi.number().valid([0,1])
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

    // let params = { 
    // 	creator: req.query.creator,
    // 	stationId: req.query.stationId
    // }
    let data = await ticketService.findAll(params)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// get user
router.get('/:id/users/:userId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    userId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let userId = req.params.userId
    let data = await ticketService.findUser(id, userId)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
// update user - station admin confirm FIXME: issues#6
/**
 * @swagger
 * /s/v1/tickets/{id}/users/{userId}:
 *   patch:
 *     summary: update user
 *     tags:
 *     - /s/tickets
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: ticket uuid
 *       type: string
 *     - name: userId
 *       in: path
 *       required: true
 *       description: user guid
 *       type: string
 *     - name: type
 *       in: body
 *       required: true
 *       description: update type
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.patch('/:id/users/:userId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    userId: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    type: Joi.string().valid(['rejected', 'resolved']).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let userId = req.params.userId
    let type = req.body.type
    let data = await ticketService.updateUser(id, type, userId)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// get users
router.get('/:id/users', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await ticketService.findAllUser(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/tickets/{id}/users:
 *   patch:
 *     summary: update users
 *     tags:
 *     - /s/tickets
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: uuid
 *       type: string
 *     - name: type
 *       in: body
 *       required: true
 *       description: update type
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.patch('/:id/users', joiValidator({
  params: {
    ids: Joi.array().items({ version: ['uuidv4'] }).required()
  },
  body: {
    type: Joi.string().valid(['rejected', 'resolved']).required()
  }
}), async (req, res) => {
  try {
    let ticketIds = req.params.ids
    let type = req.body.type
    let data = await ticketService.updateUserStatus(ticketIds, type)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

module.exports = router
