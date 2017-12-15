/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userBox.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/26 11:59:03 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/07/26 11:59:44 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = function (sequelize, DataTypes) {
  let UserBox = sequelize.define('UserBox', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      required: true
    },
    boxId: {
      type: DataTypes.UUID,
      required: true
    },
    // -1: 失效  1: 正常
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
      freezeTableName: true,
      tableName: 'user_box',
      indexes: [
        {
          name: 'status',
          method: 'BTREE',
          fields: ['status']
        },
        {
          name: 'userId',
          method: 'BTREE',
          fields: ['userId']
        },
        {
          name: 'boxId',
          method: 'BTREE',
          fields: ['boxId']
        }
      ],
      classMethods: {
        associate: function (models) {
          UserBox.belongsTo(models.Box, { foreignKey: 'boxId' })
          UserBox.belongsTo(models.User, { foreignKey: 'userId' })
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

  return UserBox
}
