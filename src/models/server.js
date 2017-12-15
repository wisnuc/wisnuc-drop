/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/16 14:08:51 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:45:10 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  let Server = sequelize.define('Server', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    WANIP: {
      type: DataTypes.STRING,
      validate: { isIP: true },
      unique: true
    },
    // may be the same
    LANIP: {
      type: DataTypes.STRING,
      validate: { isIP: true }
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },

    createdAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get: function () {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }, {
      freezeTableName: true,
      tableName: 'servers',
      classMethods: {
        associate: function (models) {

        }
      },
      defaultScope: {
        where: {
          status: 1
        }
      },
      scopes: {
        deleted: {
          status: 0
        }
      }
    })
  return Server
}
