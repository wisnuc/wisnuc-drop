/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/23 17:42:45 by JianJin Wu       ###   ########.fr       */
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
 * definitions:
 *   Box:
 *     type: object
 *     properties:
 *       uuid:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       name:
 *         type: string
 *         example: 私有群
 *       owner:
 *         allOf:
 *         - $ref: '#/definitions/User'
 *         - type: object
 *       ctime:
 *         type: number
 *         example: 1515996040812
 *       mtime:
 *         type: number
 *         example: 1515996040812
 *       status:
 *         type: number
 *         enum: 
 *         - 0
 *         - 1
 *         default: 0
 */

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
 *             $ref: '#/definitions/Box'
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
 * /c/v1/boxes/{id}:
 *   get:
 *     summary: return box
 *     tags:
 *     - /c/boxes
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
 *           $ref: '#/definitions/Box'
 */
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.find(id)
  return res.success(data)
})

/**
 * @swagger
 * /c/v1/boxes/{id}/users:
 *   get:
 *     summary: return users of box
 *     tags:
 *     - /c/boxes
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
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
router.get('/:id/users', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.findUser(id)
  return res.success(data)
})

/**
 * @swagger
 * /c/v1/boxes/{id}/users/{userId}:
 *   get:
 *     summary: return user of box
 *     tags:
 *     - /c/boxes
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
 *           $ref: '#/definitions/User'
 */
router.get('/:id/users/userId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    userId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let userId = req.params.userId
  let user = req.auth.user
  let data
  if (userId === user.Id) {
    data = await boxService.findOwner(id, user.id)
  }
  else {
    data = await boxService.findUser(id, userId)
  }
  return res.success(data)
})

module.exports = router
