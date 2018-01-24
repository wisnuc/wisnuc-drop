/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/01/24 10:53:01 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const debug = require('debug')('app')
const mongoose = require('mongoose')
const config = require('getconfig')

const { host, port, database } = config.mongodb

const DATABASE_URL = `mongodb://${host}:${port}/${database}`

mongoose.connect(DATABASE_URL, {
  promiseLibrary: Promise
})

const db = mongoose.connection

db.on('error', err => debug(`connection error:${err}`))
db.once('open', () => debug('mongodb connect successfully'))

// TODO: exports schema file
module.exports = {
  Box: require('./box'),
  BlackList: require('./blackList'),
  // TweetModelCreater: require('./tweet'),
  Tweet: require('./tweet')
}
