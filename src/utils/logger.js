/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   logger.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/01 14:09:03 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:36 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const log4js = require('log4js')
const path = require('path')

let log4jsConfig = {
  replaceConsole: true,
  appenders: [
    { type: 'console' },
    {
      'type': 'dateFile',
      'filename': path.join(__dirname, '../../logs/app/app.log'),
      'pattern': '-yyyy-MM-dd.log',
      'category': 'app',
      'alwaysIncludePattern': true
    },
    // {
    // 	'type': 'file',
    // 	'filename': path.join(__dirname, '../../logs/app.log'),
    // 	'maxLogSize': 10485760,
    // 	'numBackups': 3
    // },
    {
      'type': 'logLevelFilter',
      'level': 'ERROR',
      'appender': {
        'type': 'file',
        'filename': path.join(__dirname, '../../logs/errors.log')
      }
    }
  ]
}

log4js.configure(log4jsConfig)

let Logger = name => {
  let logger = log4js.getLogger(name)
  logger.setLevel('INFO')
  return logger
}

module.exports = { log4js, Logger }
