/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 16:21:10 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/13 16:40:46 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const jwt = require('../../../middlewares/jwt')

router.use('/account', require('./account'))
router.use('/token', require('./token'))
router.use('/tickets', require('./tickets'))

router.use('*', jwt.cAuth)	
router.use('/stations', require('./stations'))
router.use('/users', require('./users'))

// router.use('/boxes', require('./boxes'))
// router.use('/servers', require('./servers'))

module.exports = router
