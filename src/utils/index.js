/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:34:38 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:35:20 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


// module.exports = {
//   JoiValidator: require('./joiValidator')
// }
const debug = require('debug')('util')
const fs = require('fs')
const path = require('path')

let db = {}

let fileName = (file) => {
  debug(file)
  return file.toString().split('.')[0]
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    const model = path.join(__dirname, file)
    db[fileName(file)] = require(model)
  })



debug(db)

module.exports = db
