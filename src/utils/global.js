/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   global.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/04 16:33:14 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


global.Promise = require('bluebird')
global.Logger = require('./logger').Logger
global.E = require('../lib/error')

// global.server = {}
  
// demo
// const logger = Logger(__filename)

// logger.info('this is info')
// logger.warn('this is warn')
// logger.error('this is error')
