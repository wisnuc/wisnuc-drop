/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tweets.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:46 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/07 14:34:24 by JianJin Wu       ###   ########.fr       */
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
 *     required: 
 *     - id
 *     - uuid 
 *     - type
 *     - index
 *     - tweeter 
 *     - ctime
 *     properties:
 *       id:
 *         type: string
 *         example: 5a77fd3b35dfc7f1061bc976
 *       uuid:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       type:
 *         type: string
 *         example: blob
 *         enum:
 *         - blob
 *         - list
 *         - commit
 *       comment:
 *         type: string
 *         example: hello
 *       commitId:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       index:
 *         type: number
 *         example: 1
 *       parent:
 *         type: number
 *         example: 0
 *       tweeter:
 *         type: string
 *         example: f0066784-7985-4dc4-9b20-4ea5a14434e8
 *       ctime:
 *         type: number
 *         example: 1515996040812
 *       list:
 *         type: array
 *         example: []
 */

/**
 * @swagger
 * /s/v1/tweets:
 *   post:
 *     summary: return tweets
 *     tags:
 *     - /s/tweets
 *     parameters:
 *     - name: uuid
 *       in: body
 *       required: true
 *       description: uuid
 *       type: string
 *     - name: type
 *       in: body
 *       required: true
 *       description: uuid
 *       type: string
 *     - name: index
 *       in: body
 *       required: true
 *       description: uuid
 *       type: string
 *     - name: boxId
 *       in: body
 *       required: true
 *       description: box uuid
 *       type: string
 *     - name: ctime
 *       in: body
 *       required: true
 *       description: create time
 *       type: number
 *     - name: parent
 *       in: body
 *       required: false
 *       description: parent uuid
 *       type: number
 *     - name: tweeter
 *       in: body
 *       required: true
 *       description: user uuid
 *       type: string
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
    boxId: Joi.string().required(),
    tweeter: Joi.string().required(),
    ctime: Joi.number().required(),
    parent: Joi.number(),
    list: Joi.array(),
    comment: Joi.string().empty('')
  }
}), async (req, res) => {
  try {
    let station = req.auth.station
    let options = Object.assign({}, req.body, { stationId: station.id})
    let data = await tweetService.create(options)
    return res.success(data)
  }
  catch(err) {
    return res.error(err)
  }
})

module.exports = router
