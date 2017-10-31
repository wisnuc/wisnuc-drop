/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   account.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/06 10:29:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/10/31 18:06:36 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// don`t follow the rule of restful
const express = require('express')
const router = express.Router()

const Joi = require('joi')
const joiValidator = require('../../../middlewares/joiValidator')
const accountService = require('../../../services/accountService')

const uuid = require('uuid')
let map = new Map()


// TODO: test
router.post('/', async (req, res) => {
	try {
		return res.success()
	}
	catch(err) {
		return res.error(err)
	}
})

// binding wechat account
router.get('/wechat/binding', joiValidator({
	body: {
		code: Joi.string().required(),
		platform: Joi.string().valid(['web', 'mobile']).required()
	}
}), async (req, res) => {
	try {
		let code = req.query.code
		let platform = req.query.platform
		let data = await accountService.bindingWechat(platform, code)
		return res.success(data)
	}
	catch(err) {
		return res.error(err)
	}
})


module.exports = router

