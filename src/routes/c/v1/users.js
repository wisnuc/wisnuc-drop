/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const userService = require('../../../services/userService')


/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required: 
 *     - id
 *     - status 
 *     - nickName
 *     - avatarUrl
 *     properties:
 *       id:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       status:
 *         type: number
 *         example: 1
 *       nickName:
 *         type: string
 *         example: mosaic
 *       avatarUrl:
 *         type: string
 *         example: https://wx.qlogo.cn
 *         enum: 
 *         - 0
 *         - 1
 *         default: 0
 */


/**
 * @swagger
 * /c/v1/users/{id}:
 *   get:
 *     summary: return user
 *     tags:
 *     - /c/users
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: user guid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await userService.find(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/users/{id}/stations:
 *   get:
 *     summary: return all stations of this user
 *     tags:
 *     - /c/users
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: user guid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get('/:id/stations', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await userService.findStations(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/users/{userId}/interestingPerson:
 *   get:
 *     summary: return interesting person
 *     tags:
 *     - /c/users
 *     parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: user guid
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
 *                 example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *               nickName:
 *                 type: string
 *                 example: mosaic
 *               avatarUrl:
 *                 type: string
 *                 example: https://wx.qlogo.cn
 */
router.get('/:userId/interestingPerson', joiValidator({
  params: {
    userId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let userId = req.params.userId
    let data = await userService.findInteresting(userId)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

/**
 * @swagger
 * /c/v1/users/{userId}/interestingPerson/{personId}:
 *   get:
 *     summary: return interesting person data sources
 *     tags:
 *     - /c/users
 *     parameters:
 *     - name: userId
 *       in: path
 *       required: true
 *       description: user guid
 *       type: string
 *     - name: personId
 *       in: path
 *       required: true
 *       description: user guid
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
 *                 example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *               name:
 *                 type: string
 *                 example: HomeStation
 *               LANIP:
 *                 type: string
 *                 example: 10.10.9.128
 *               boxes:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/Box'
 */
router.get('/:userId/interesting/personId', joiValidator({
  params: {
    userId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    personId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let personId = req.params.personId
    let data = await userService.findInterestingSources(personId)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

module.exports = router
