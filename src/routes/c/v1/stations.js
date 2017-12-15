/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:44:32 by JianJin Wu       ###   ########.fr       */
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

// check double arrow
function checkDoubleArrow() {
  return function (req, res, next) {
    let userId = req.auth.user.id
    let stationId = req.params.id
    return stationService.clientCheckStation(userId, stationId)
      .then(flag => {
        if (!flag) {
          return res.error(new Error('check double arrow failed'), 401)
        }
        next()
      })
      .catch(err => {
        return res.error(err, 401)
      })
  }
}

// get station
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

// get users
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

// store file
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

// fetch file
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

// GET json transform
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

// POST json transform
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
