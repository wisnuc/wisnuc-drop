/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweets.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/30 14:38:01 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const tweetService = require('../../../services/tweetService')

// TODO: tweets authorization

/**
 * @swagger
 * definitions:
 *   Tweet:
 *     type: object
 *     properties:
 *       uuid:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       type:
 *         type: string
 *         example: blob
 *         num:
 *         - blob
 *         - list
 *         - commit
 *       comment:
 *         type: string
 *         example: hello
 *       index:
 *         type: number
 *         example: 1
 *       parent:
 *         type: number
 *         example: 0
 *       tweeter:
 *         type: string
 *         example: 0
 *       ctime:
 *         type: number
 *         example: 1515996040812
 */

/**
 * @swagger
 * /s/v1/tweets:
 *   get:
 *     summary: return tweets
 *     tags:
 *     - /s/tweets
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Tweet'
 */
router.post('/', joiValidator({
  body: {
    uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
    type: Joi.string().required(),
    index: Joi.number().required(),
    parent: Joi.number().required(),
    tweeter: Joi.string(),
    ctime: Joi.number().required()
  }
}), async (req, res) => {
  try {
    let options = Object.assign({}, req.body, { stationId: req.auth.station.id})
    let data = await tweetService.create(options)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/tweets/{id}:
 *   get:
 *     summary: return tweet
 *     tags:
 *     - /s/tweets
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
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
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
//   // create tweets
//   if (create) {
//     data = await tweetService.bulkCreate(create)
//   }
//   // update tweets
//   if (update) {
//     data = await tweetService.bulkUpdate(update)
//   }
//   // destroy tweets
//   if (destroy) {
//     data = await tweetService.bulkDestroy(destroy)
//   }
//   return res.success(data)
// })

module.exports = router
