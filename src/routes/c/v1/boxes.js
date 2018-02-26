/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/24 15:03:28 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const boxService = require('../../../services/boxService')

// TODO: boxes authorization

/**
 * @swagger
 * /c/v1/boxes:
 *   get:
 *     summary: return boxes
 *     tags:
 *     - /c/boxes
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               id:
 *                 type: string
 *                 example: 5a77fd3b35dfc7f1061bc976
 *               uuid:
 *                 type: string
 *                 example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *               name:
 *                 type: string
 *                 example: 私有群
 *               owner:
 *                 type: string
 *                 example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *               users:
 *                 type: array
 *                 items: 
 *                   $ref: '#/definitions/User'
 *               stationId:
 *                 allOf:
 *                 - $ref: '#/definitions/Station'
 *                 - type: object
 *               ctime:
 *                 type: number
 *                 example: 1515996040812
 *               mtime:
 *                 type: number
 *                 example: 1515996040812
 *               tweet:
 *                 allOf:
 *                 - $ref: '#/definitions/Tweet'
 *                 - type: object
 */
router.get('/', async (req, res) => {
  try {
    let user = req.auth.user
    let data = await boxService.findAll(user.id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/boxes/{boxId}:
 *   get:
 *     summary: return box
 *     tags:
 *     - /c/boxes
 *     parameters:
 *     - name: boxId
 *       in: path
 *       required: true
 *       description: uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/Box'
 */
router.get('/:boxId', joiValidator({
  params: {
    boxId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let boxId = req.params.boxId
    let data = await boxService.find(boxId)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/boxes/{boxId}/users:
 *   get:
 *     summary: return all users of this box
 *     tags:
 *     - /c/boxes
 *     parameters:
 *     - name: boxId
 *       in: path
 *       required: true
 *       description: uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
router.get('/:boxId/users', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await boxService.findUser(id)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
  
})

/**
 * @swagger
 * /c/v1/boxes/{boxId}/ticket:
 *   get:
 *     summary: return share ticket
 *     tags:
 *     - /c/boxes
 *     parameters:
 *     - name: boxId
 *       in: path
 *       required: true
 *       description: uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Ticket'
 */
router.get('/:boxId/ticket', joiValidator({
  params: {
    boxId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let boxId = req.params.boxId
    let data = await boxService.findShareTicket(boxId)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

module.exports = router
