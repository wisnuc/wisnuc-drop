/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   global.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/04 16:33:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/29 18:25:17 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


global.Promise = require('bluebird')
global.Logger = require('./logger').Logger

// demo
// const logger = Logger(__filename)

// logger.info('this is info')
// logger.warn('this is warn')
// logger.error('this is error')