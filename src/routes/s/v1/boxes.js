/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/24 16:06:04 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const boxService = require('../../../services/boxService')
const tweetService = require('../../../services/tweetService')

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
 *       users:
 *         type: array
 *         items: 
 *           type: string
 *           example: f7b71a94-6827-4532-a8f2-5a9ee454355b
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
 * /s/v1/boxes:
 *   post:
 *     summary: new box 
 *     tags:
 *     - /s/boxes
 *     parameters:
 *     - name: name
 *       in: body
 *       required: true
 *       description: box name
 *       type: string
 *     - name: uuid
 *       in: body
 *       required: true
 *       type: uuid
 *     - name: owner
 *       in: body
 *       required: true
 *       description: box owner
 *       type: uuid
 *     - name: users
 *       in: body
 *       required: false
 *       description: box users
 *       type: array
 *     - name: ctime
 *       in: body
 *       required: true
 *       description: box create timestamp
 *       type: uuid
 *     - name: mtime
 *       in: body
 *       required: true
 *       description: box update timestamp
 *       type: uuid
 *     responses:
 *       200:
 *         description: success
 */
router.post('/', joiValidator({
  body: {
    name: Joi.string().required(),
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
    owner: Joi.string().guid({ version: ['uuidv4'] }).required(),
    users: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }).required()),
    ctime: Joi.number().required(),
    mtime: Joi.number().required()
  }
}), async (req, res) => {
  try {
    let options = Object.assign({}, req.body)
    let data = await boxService.create(options)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /s/v1/boxes/{boxId}:
 *   patch:
 *     summary: update box
 *     tags:
 *     - /s/boxes
 *     parameters:
 *     - name: boxId
 *       in: params
 *       required: true
 *       description: box uuid
 *       type: string
 *     - name: name
 *       in: body
 *       required: false
 *       description: box name
 *       type: string
 *     - name: users
 *       in: body
 *       required: false
 *       description: box users
 *       type: array
 *     - name: mtime
 *       in: body
 *       required: false
 *       description: box update timestamp
 *       type: uuid
 *     responses:
 *       200:
 *         description: success
 */
router.patch('/:boxId', joiValidator({
  params: {
    boxId: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    name: Joi.string(),
    users: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }).required()),
    mtime: Joi.number()
  }
}), async (req, res) => {
  try {
    let options = Object.assign({}, { uuid: req.params.boxId }, req.body)
    let data = await boxService.update(options)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /s/v1/boxes/{boxId}:
 *   delete:
 *     summary: delete box
 *     tags:
 *     - /s/boxes
 *     parameters:
 *     - name: boxId
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
router.delete('/:boxId', joiValidator({
  params: {
    boxId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let boxId = req.params.boxId
    let data = await boxService.delete(boxId)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})


module.exports = router
