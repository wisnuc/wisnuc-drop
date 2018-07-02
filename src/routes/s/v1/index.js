/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 16:21:10 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/02 17:39:25 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

const authStation = require('../../../middlewares/authStation')

router.use('/stations', require('./stations'))
router.use('*', authStation())
router.use('/tickets', require('./tickets'))
router.use('/users', require('./users'))
router.use('/boxes', require('./boxes'))
router.use('/tweets', require('./tweets'))

module.exports = router
