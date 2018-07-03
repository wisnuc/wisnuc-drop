/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/03 13:52:56 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const jwt = require('../../../middlewares/jwt')
const stationService = require('../../../services/stationService')
const fetchFile = require('../../../services/fetchFile')
const storeFile = require('../../../services/storeFile')
const transformJson = require('../../../services/transformJson')

/**
 * @swagger
 * definitions:
 *   SToken:
 *     type: object
 *     required: 
 *     - token
 *     - station
 *     properties:
 *       token:
 *         type: string
 *         example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
 *       station:
 *         type: object
 *         properties:
 *           id: 
 *             type: string
 *             example: 6e6c0c4a-967a-489a-82a2-c6eb6fe9d991
 *           name:
 *             type: string
 *             example: station_123456
 */


/**
 * @swagger
 * /s/v1/token:
 *   get:
 *     summary: return station token
 *     tags:
 *     - /s/token
 *     parameters:
 *     - name: code
 *       in: query
 *       required: true
 *       description: code
 *       type: string
 *     - name: platform
 *       in: query
 *       required: true
 *       description: web or mobile
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/SToken'
 *          
 */
router.get('/:id/token', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let stationId = req.params.id
    let data = await stationService.getToken(stationId)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations:
 *   post:
 *     summary: new station without token
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: name
 *       in: body
 *       required: false
 *       description: station name
 *       type: string
 *     - name: LANIP
 *       in: body
 *       required: false
 *       description: LANIP
 *       type: string
 *     - name: publicKey
 *       in: body
 *       required: true
 *       description: station public key
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/', joiValidator({
  body: {
    name: Joi.string().max(12).truncate(),	// optional
    LANIP: Joi.string(), 									  // optional
    publicKey: Joi.string().required()
  }
}), async (req, res) => {
  try {
    let station = req.body
    let data = await stationService.create(station)
    return res.success({
      id: data.id
    })
  }
  catch (err) {
    return res.error(err)
  }
})

// authorization
router.use('*', jwt.sAuth)

/**
 * @swagger
 * /s/v1/stations/{id}:
 *   get:
 *     summary: return station
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/Station'
 */
router.get('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    let id = req.params.id
    let data = await stationService.find(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}:
 *   patch:
 *     summary: update station
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: name
 *       in: body
 *       required: true
 *       description: station name
 *       type: string
 *     - name: LANIP
 *       in: body
 *       required: true
 *       description: LANIP
 *       type: string
 *     - name: userIds
 *       in: body
 *       required: true
 *       description: userId array
 *       type: array
 *     responses:
 *       200:
 *         description: success
 */
router.patch('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    name: Joi.string().max(12).truncate(),	// optional
    LANIP: Joi.string(), 									  // optional
    userIds: Joi.array().items(Joi.string().guid({ version: ['uuidv4'] }))
  }
}), async (req, res) => {
  try {
    // update station
    if (req.body.name || req.body.LANIP) {
      let station = Object.assign({}, {
        id: req.params.id,
        name: req.body.name,
        LANIP: req.body.LANIP
      })
      await stationService.update(station)
    }
    // update users
    if (req.body.userIds && req.body.userIds.length !== 0) {
      await stationService.updateUsers(req.params.id, req.body.userIds)
    }
    return res.success()
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}:
 *   delete:
 *     summary: delete station
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.delete('/:id', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  let id = req.params.id
  let data = await stationService.delete(id)
  return res.success(data)
})
/**
 * @swagger
 * /s/v1/stations/{id}/users:
 *   get:
 *     summary: return users of this station
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
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
  try {
    let id = req.params.id
    let data = await stationService.findUsers(id)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}:
 *   get:
 *     summary: store file
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: jobId
 *       in: path
 *       required: true
 *       description: job uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.get('/:id/response/:jobId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), (req, res) => {
  try {
    storeFile.request(req, res)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}/pipe/store:
 *   post:
 *     summary: response store file result to client
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: jobId
 *       in: path
 *       required: true
 *       description: job uuid
 *       type: string
 *     - name: error
 *       in: body
 *       required: true
 *       description: response error
 *       type: string
 *     - name: data
 *       in: body
 *       required: true
 *       description: response data
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/:id/response/:jobId/pipe/store', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    // jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    error: Joi.any(),
    data: Joi.any()
  }
}), (req, res) => {
  try {
    // response
    storeFile.response(req, res)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}:
 *   post:
 *     summary: fetch file
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: jobId
 *       in: path
 *       required: true
 *       description: job uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/:id/response/:jobId', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    fetchFile.request(req, res)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}/pipe/fetch:
 *   post:
 *     summary: response fetch error to client 
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: jobId
 *       in: path
 *       required: true
 *       description: job uuid
 *       type: string
 *     - name: message
 *       in: body
 *       required: true
 *       description: response message
 *       type: string
 *     - name: code
 *       in: body
 *       required: true
 *       description: response code
 *       type: number
 *     responses:
 *       200:
 *         description: success
 */
router.post('/:id/response/:jobId/pipe/fetch', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
  },
  body: {
    message: Joi.string().required(),
    code: Joi.number().required()
  }
}), async (req, res) => {
  try {
    // response
    fetchFile.response(req, res)
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /s/v1/stations/{id}/response/{jobId}/json:
 *   post:
 *     summary: response json error to client
 *     tags:
 *     - /s/stations
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: station uuid
 *       type: string
 *     - name: jobId
 *       in: path
 *       required: true
 *       description: job uuid
 *       type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/:id/response/:jobId/json', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    jobId: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), async (req, res) => {
  try {
    transformJson.request(req, res)
  }
  catch (err) {
    return res.error(err)
  }
})


module.exports = router
