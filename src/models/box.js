/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:44:56 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  let Box = sequelize.define('Box', {

    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    ownerId: {
      type: DataTypes.UUID,
      required: true
    },
    // -1: 失效 0: 未审核 1: 正常
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
      tableName: 'boxes',
      indexes: [
        {
          name: 'ownerId',
          method: 'BTREE',
          fields: ['ownerId']
        },
        {
          name: 'name',
          method: 'BTREE',
          fields: ['name']
        }
      ],
      classMethods: {
        associate: function (models) {
          Box.hasMany(models.BoxUser, { foreignKey: 'boxId', as: 'users' })
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

  return Box
}
