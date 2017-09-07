/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 16:21:10 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/09 10:26:44 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express')
const router = express.Router()

router.use('/v1', require('./v1'))

module.exports = router

