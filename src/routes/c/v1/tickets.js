/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tickets.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/28 13:25:27 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/22 18:31:23 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const jwt = require('../../../middlewares/jwt')
const ticketService = require('../../../services/ticketService')

/**
 * @swagger
 * definitions:
 *   Ticket:
 *     type: object
 *     required: 
 *     - id
 *     - creator 
 *     - type
 *     - stationId
 *     properties:
 *       id:
 *         type: string
 *         example: 00000071-e843-4cdb-a279-c7ce802558ec
 *       creator:
 *         type: string
 *         example: f7b71a94-6827-4532-a8f2-5a9ee454355b
 *       type:
 *         type: string
 *         enum: 
 *         - bind
 *         - invite
 *         - box
 *         example: bind
 *       stationId:
 *         type: string
 *         example: 4ea6038b-1003-4cc6-ac34-51d83e3f24da
 *       expiredDate:
 *         type: string
 *         format: dateTime
 *         example: 2017-11-24 22:01:31
 *       status:
 *         type: number
 *         description: 0 未消费 1 已使用
 *         enum: 
 *         - 0
 *         - 1
 *         default: 0
 * 
 */

/**
 * @swagger
 * /c/v1/tickets/{id}:
 *   get:
 *     summary: return ticket
 *     tags:
 *     - /c/tickets
 *     parameters:
 *     - name: id
 *       in: query
 *       required: true
 *       description: uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *             $ref: '#/definitions/Ticket'
 *             type: object
 *             additionalProperties:
 *               creatorInfo:
 *                 id: 
 *                 type: string
 *                 example: f7b71a94-6827-4532-a8f2-5a9ee454355b
 *               nickName:
 *                 type: string
 *                 example: https://wx.qlogo.cn
 */

/**
 * 
 */
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let user = req.auth.user
    let data = await ticketService.findByClient(id, user.id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// invite user for mini program
router.post('/:id/invite', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
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
  catch (err) {
    return res.error(err)
  }
})

// get all tickets
router.get('/', joiValidator({
  query: {
    creator: Joi.string().guid({ version: ['uuidv4'] }),
    stationId: Joi.string().guid({ version: ['uuidv4'] }),
    status: Joi.number().valid([0, 1])
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
  catch (err) {
    return res.error(err)
  }
})

// fill ticket (except invite)
router.post('/:id/users', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
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
  catch (err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/tickets/{id}/users/{userId}:
 *   get:
 *     summary: return ticket_user
 *     tags:
 *     - /c/tickets
 *     parameters:
 *     - name: id
 *       in: query
 *       required: true
 *       description: uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *         type: object
 *         properties:
 *           uuid:
 *             type: string
 *             example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *           name:
 *             type: string
 *             example: 私有群
 *           extras:
 *             type: object
 *             additionalProperties:
 *               type: string
 *               example: 私有群
 *               extra: foo
 */
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


module.exports = router
