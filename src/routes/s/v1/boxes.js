/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/23 17:28:42 by JianJin Wu       ###   ########.fr       */
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
 *     - name: owner
 *       in: body
 *       required: true
 *       description: box owner
 *       type: uuid
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
    ownerId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    ctime: Joi.number().required(),
    mtime: Joi.number().required()
  }
}), async (req, res) => {
  let options = Object.assign({}, req.body)
  let data = await boxService.create(options)
  return res.success(data)
})

/**
 * @swagger
 * /s/v1/boxes/{id}:
 *   patch:
 *     summary: update box
 *     tags:
 *     - /s/boxes
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
router.patch('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.update(id)
  return res.success(data)
})

/**
 * @swagger
 * /s/v1/boxes/{id}:
 *   delete:
 *     summary: delete box
 *     tags:
 *     - /s/boxes
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
router.delete('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.delete(id)
  return res.success(data)
})


module.exports = router
