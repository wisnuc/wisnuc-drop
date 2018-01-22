/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/22 14:04:50 by JianJin Wu       ###   ########.fr       */
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
 */


/**
 * @swagger
 * /c/v1/users:
 *   get:
 *     summary: return users
 *     tags:
 *     - /c/users
 *     parameters:
 *     - name: id
 *       in: query
 *       required: true
 *       description: code
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

// update user
router.patch('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    nickName: Joi.string(),
    avatarUrl: Joi.string()
  }
}), async (req, res) => {
  try {
    let user = Object.assign({}, req.params, req.body)
    let data = await userService.update(user)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// delete user
router.delete('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.body.id
    let data = await userService.delete(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

// get stations
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

// get friends
router.get('/:id/friends', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await userService.findFriends(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

module.exports = router
