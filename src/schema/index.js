/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:42:05 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const mongoose = require('mongoose')
const config = require('getconfig')

const { host, port, database } = config.mongodb

const DATABASE_URL = 'mongodb://'
  + host + ':'
  + port + '/'
  + database

// mongoose.connect(DATABASE_URL)

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
// 	console.log('mongodb connect successfully')
// })


module.exports = {
  Box: require('./box'),
  BlackList: require('./blackList'),
  TweetModelCreater: require('./tweet')
}
