/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const boxService = require('../../../services/boxService')

/**
 * @swagger
 * definitions:
 *   Box:
 *     type: object
 *     required: 
 *     - id
 *     - uuid 
 *     - owner
 *     - users 
 *     - stationId
 *     - ctime
 *     - mtime
 *     properties:
 *       id:
 *         type: string
 *         example: 5a77fd3b35dfc7f1061bc976
 *       uuid:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       name:
 *         type: string
 *         example: 私有群
 *       owner:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       users:
 *         type: array
 *         items: 
 *           $ref: '#/definitions/User'
 *       stationId:
 *         type: string
 *         example: 8c015542-b7fb-4c21-ad23-e0c31ad015da
 *       ctime:
 *         type: number
 *         example: 1515996040812
 *       mtime:
 *         type: number
 *         example: 1515996040812
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
 *       required: false
 *       description: box name
 *       type: string
 *     - name: uuid
 *       in: body
 *       required: true
 *       type: string
 *     - name: owner
 *       in: body
 *       required: true
 *       description: box owner
 *       type: string
 *     - name: users
 *       in: body
 *       required: false
 *       description: box users
 *       type: array
 *     - name: ctime
 *       in: body
 *       required: true
 *       description: box create timestamp
 *       type: number
 *     - name: mtime
 *       in: body
 *       required: true
 *       description: box update timestamp
 *       type: number
 *     responses:
 *       200:
 *         description: success
 */
router.post('/', joiValidator({
  body: {
    name: Joi.string().empty(''),
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
    owner: Joi.string().guid({ version: ['uuidv4'] }).required(),
    users: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }).required()),
    ctime: Joi.number().required(),
    mtime: Joi.number().required()
  }
}), async (req, res) => {
  try {
    let station = req.auth.station
    let options = Object.assign({}, req.body, { stationId: station.id})
    let data = await boxService.create(options)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

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
    create: Joi.array().items(Joi.object({
      name: Joi.string().empty(''),
      uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
      owner: Joi.string().guid({ version: ['uuidv4'] }).required(),
      users: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }).required()),
      ctime: Joi.number().required(),
      mtime: Joi.number().required(),
      tweet: Joi.object()
    }))
  }
}), async (req, res) => {
  try {
    let station = req.auth.station
    let { create } = req.body
    let data = await boxService.bulkCreate(station.id, create)
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
 *       in: path
 *       required: true
 *       description: box uuid
 *       type: string
 *     - name: name
 *       in: body
 *       required: false
 *       description: box name
 *       type: string
 *     - name: owner
 *       in: body
 *       required: false
 *       description: owner
 *       type: string
 *     - name: users
 *       in: body
 *       required: false
 *       description: box users
 *       type: array
 *     - name: mtime
 *       in: body
 *       required: true
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
    name: Joi.string().empty(''),
    owner: Joi.string().guid({ version: ['uuidv4'] }),
    users: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }).required()),
    mtime: Joi.number().required()
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
