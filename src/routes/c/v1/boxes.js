/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/30 11:22:49 by JianJin Wu       ###   ########.fr       */
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
 * /c/v1/boxes/{boxId}:
 *   get:
 *     summary: return box
 *     tags:
 *     - /c/boxes
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
 *     summary: return users of box
 *     tags:
 *     - /c/boxes
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
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
router.get('/:boxId/users', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.findUser(id)
  return res.success(data)
})

module.exports = router
