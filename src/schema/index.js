/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/28 15:32:44 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// const fs = require('fs')
// const path = require('path')
const debug = require('debug')('app:mongo')
const mongoose = require('mongoose')
const config = require('getconfig')

const { username, password, host, port, database } = config.mongodb

const DATABASE_URL = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`

mongoose.Promise = global.Promise
const options = {
  useMongoClient: true,
  autoIndex: true, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
}

mongoose.connect(DATABASE_URL, options, () => {
  debug('mongodb connect successfully')
})


// let db = {}

// fs
//   .readdirSync(__dirname)
//   .filter(function (file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js')
//   })
//   .forEach(function (file) {
//     // let model = sequelize.import(path.join(__dirname, file))
//     // db[model.name] = model
//     debug(file)
//   })

// Object.keys(db).forEach(function (modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db)
//   }
// })

// debug(db)

// TODO: exports schema file
module.exports = {
  Box: require('./box'),
  BlackList: require('./blackList'),
  // TweetModelCreater: require('./tweet'),
  Tweet: require('./tweet')
}
