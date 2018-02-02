/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/19 14:39:23 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/02 11:36:09 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')


const { mysql } = require('getconfig')

// FIXME: connect ETIMEOUT
let sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, mysql)
let db = {}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    let model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

db.Sequelize = Sequelize

db.WisnucDB = sequelize

// Sync all models that aren't already in the database
sequelize.sync().then(function () { })

// Force sync all models
// sequelize.sync({force: true})

// Force syns UserStation model
// db.UserStation.sync({force: true})

// Drop all tables
// sequelize.drop()

module.exports = db
