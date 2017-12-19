/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   token.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/19 11:39:13 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/19 15:45:08 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const tokenService = require('../../../services/tokenService')

/**
 * @swagger
 * definitions:
 *   CToken:
 *     type: object
 *     properties:
 *       user:
 *         type: object
 *         properties:
 *           id: 
 *             type: string
 *             example: 6e6c0c4a-967a-489a-82a2-c6eb6fe9d991
 *           nickName:
 *             type: string
 *             example: mosaic
 *           avatarUrl:
 *             type: string
 *             example: https://wx.qlogo.cn
 *       token:
 *         type: string
 *         example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
 */


/**
 * @swagger
 * /c/v1/token:
 *   get:
 *     summary: return web, mobile token
 *     tags:
 *       - /c/token
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         description: code
 *         type: string
 *       - name: platform
 *         in: query
 *         required: true
 *         description: web or mobile
 *         type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/CToken'
 *          
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
 * @swagger
 * /c/v1/token:
 *   post:
 *     summary: return small program token
 *     tags:
 *       - /c/token
 *     parameters:
 *       - name: code
 *         in: body
 *         required: true
 *         description: code
 *         type: string
 *       - name: iv
 *         in: body
 *         required: true
 *         description: iv
 *         type: string
 *       - name: encryptedData
 *         in: body
 *         required: true
 *         description: encryptedData
 *         type: string
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/CToken'
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
