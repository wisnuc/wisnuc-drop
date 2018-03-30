/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userStation.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/07 17:10:35 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = function (sequelize, DataTypes) {
  let UserStation = sequelize.define('UserStation', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      required: true
    },
    stationId: {
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
    tableName: 'user_station',
    indexes: [
      {
        name: 'userId',
        method: 'BTREE',
        fields: ['userId']
      },
      {
        name: 'stationId',
        method: 'BTREE',
        fields: ['stationId']
      }
    ],
    classMethods: {
      associate: function (models) {
        UserStation.belongsTo(models.User, { foreignKey: 'userId' })
        UserStation.belongsTo(models.Station, { foreignKey: 'stationId' })
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

  return UserStation
}
