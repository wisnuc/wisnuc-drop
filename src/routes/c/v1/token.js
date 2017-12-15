/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/19 11:39:13 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:44:17 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const tokenService = require('../../../services/tokenService')

/**
 * web, mobile login
 * return token
 */
router.get('/', joiValidator({
  query: {
    code: Joi.string().required(),
    platform: Joi.string().valid(['web', 'mobile']).required()
  }
}), async (req, res) => {
  try {
    let code = req.query.code
    let platform = req.query.platform
    let data = await tokenService.oauth2(platform, code)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

/**
 * mp login
 * return token
 */
router.post('/', joiValidator({
  body: {
    code: Joi.string().required(),
    iv: Joi.string().required(),
    encryptedData: Joi.string().required()
  }
}), async (req, res) => {
  try {
    let code = req.body.code
    let iv = req.body.iv
    let encryptedData = req.body.encryptedData
    let data = await tokenService.mpToken(code, iv, encryptedData)
    return res.success(data)
  }
  catch (err) {
    return res.error(err)
  }
})

module.exports = router
