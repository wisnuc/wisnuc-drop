/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')

const stationService = require('../../../services/stationService')
const fetchFile = require('../../../services/fetchFile')
const storeFile = require('../../../services/storeFile')
const transformJson = require('../../../services/transformJson')

/**
 * @swagger
 * definitions:
 *   Station:
 *     type: object
 *     required: 
 *     - id
 *     - name
 *     - LANIP
 *     - isOnline
 *     - status
 *     properties:
 *       id:
 *         type: string
 *         example: 6e6c0c4a-967a-489a-82a2-c6eb6fe9d991
 *       name:
 *         type: string
 *         example: WISNUC_1513060364831
 *       LANIP:
 *         type: string
 *         example: 192.168.8.128
 *       isOnline:
 *         type: number
 *         example: 1
 *       status:
 *         type: number
 *         example: 1
 */

// station auth: check double arrow
// FIXME: box auth: only user have wechat account
function checkDoubleArrow() {
  return function (req, res, next) {
    let userId = req.auth.user.id
    let stationId = req.params.id
    return stationService.clientCheckStation(userId, stationId)
      .then(flag => {
        if (!flag) {
          return res.error(new Error('check double arrow failed'), 401, false)
        }
        next()
      })
      .catch(err => {
        return res.error(err, 401, false)
      })
  }
}
/**
 * @swagger
 * /c/v1/stations/{id}:
 *   get:
 *     summary: return station
 *     tags:
 *     - /c/stations
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
 * /c/v1/stations/{id}/users:
 *   get:
 *     summary: return users of this station
 *     tags:
 *     - /c/stations
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
 * /c/v1/stations/{id}/pipe:
 *   post:
 *     summary: store file
 *     tags:
 *     - /c/stations
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
router.post('/:id/pipe', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), checkDoubleArrow(), async (req, res) => {
  try {
    let server = storeFile.createServer(req, res)
    server.run()
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /c/v1/stations/{id}/pipe:
 *   get:
 *     summary: fetch file
 *     tags:
 *     - /c/stations
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
router.get('/:id/pipe', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), checkDoubleArrow(), async (req, res) => {
  try {
    let server = fetchFile.createServer(req, res)
    server.run()
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /c/v1/stations/{id}/json:
 *   get:
 *     summary: GET json transform
 *     tags:
 *     - /c/stations
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
router.get('/:id/json', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), checkDoubleArrow(), async (req, res) => {
  let server
  try {
    server = transformJson.createServer(req, res)
    await server.run()
  }
  catch (err) {
    return res.error(err)
  }
})
/**
 * @swagger
 * /c/v1/stations/{id}/json:
 *   post:
 *     summary: POST json transform
 *     tags:
 *     - /c/stations
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
router.post('/:id/json', joiValidator({
  params: {
    id: Joi.string().guid({ version: ['uuidv4'] }).required()
  }
}), checkDoubleArrow(), async (req, res) => {
  try {
    let server = transformJson.createServer(req, res)
    await server.run()
  }
  catch (err) {
    return res.error(err)
  }
})


module.exports = router
