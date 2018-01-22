/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxes.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/22 14:12:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const boxService = require('../../../services/boxService')
const tweetService = require('../../../services/tweetService')

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
 */

/**
 * @swagger
 * /c/v1/boxes:
 *   get:
 *     summary: return boxes
 *     tags:
 *     - /c/boxes
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
 *           $ref: '#/definitions/Box'
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
 * /c/v1/boxes:
 *   post:
 *     summary: new box 
 *     tags:
 *     - /c/boxes
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
 *           $ref: '#/definitions/Box'
 */
router.post('/', joiValidator({
  body: {
    name: Joi.string().required(),
    ownerId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let options = Object.assign({}, req.body)
  let data = await boxService.create(options)
  return res.success(data)
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
 * /c/v1/boxes/{id}:
 *   patch:
 *     summary: update box
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
 * /c/v1/boxes/{id}:
 *   delete:
 *     summary: delete box
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
router.delete('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await boxService.delete(id)
  return res.success(data)
})

/**
 * @swagger
 * /c/v1/boxes/{id}/users:
 *   get:
 *     summary: delete box
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
 *     summary: delete box
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

/**
 * @swagger
 * definitions:
 *   Tweet:
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
 */

/**
 * @swagger
 * /c/v1/boxes/{id}/tweets/{tweetId}:
 *   get:
 *     summary: delete box
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
 *           $ref: '#/definitions/Tweet'
 */
router.get('/:id/tweets/tweetId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    tweetId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let data = await tweetService.find(req.params.id, req.query)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
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
// router.post('/batch', joiValidator({
//   body: {
//     create: Joi.array(),
//     update: Joi.array(),
//     destroy: Joi.array()
//   }
// }), async (req, res) => {
//   let { create, update, destroy } = req.body
//   let data
//   // create boxes
//   if (create) {
//     data = await boxService.bulkCreate(create)
//   }
//   // update boxes
//   if (update) {
//     data = await boxService.bulkUpdate(update)
//   }
//   // destroy boxes
//   if (destroy) {
//     data = await boxService.bulkDestroy(destroy)
//   }
//   return res.success(data)
// })

module.exports = router
