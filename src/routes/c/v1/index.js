/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 16:21:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const jwt = require('../../../middlewares/jwt')

router.use('/token', require('./token'))

router.use('*', jwt.cAuth)	
router.use('/tickets', require('./tickets'))
router.use('/stations', require('./stations'))
router.use('/users', require('./users'))
router.use('/boxes', require('./boxes'))

module.exports = router
