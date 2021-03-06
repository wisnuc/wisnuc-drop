/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/28 10:14:00 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  let Ticket = sequelize.define('Ticket', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    // creator == undefinded, when type == bind
    creator: DataTypes.STRING,

    // invite, bind, share
    type: {
      type: DataTypes.STRING,
      required: true
    },
    stationId: {
      type: DataTypes.UUID,
      required: true
    },
    // only exist when type === share
    boxId: DataTypes.UUID,
    isAudited: DataTypes.BOOLEAN,
    
    expiredDate: DataTypes.DATE,
    data: DataTypes.TEXT,
    // 0 未消费 1 已使用
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // default 0
    },
    // createdAt: {
    // 	type: DataTypes.DATE,
    // 	get: function() {
    // 		return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
    // 	}
    // },
    // updatedAt: {
    // 	type: DataTypes.DATE,
    // 	get: function() {
    // 		return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
    // 	}
    // }
  }, {
    freezeTableName: true,
    tableName: 'tickets',
    indexes: [
      {
        name: 'type',
        method: 'BTREE',
        fields: ['type']
      },
      {
        name: 'creator',
        method: 'BTREE',
        fields: ['creator']
      },
      {
        name: 'stationId',
        method: 'BTREE',
        fields: ['stationId']
      },
      {
        name: 'boxId',
        method: 'BTREE',
        fields: ['boxId']
      }
    ],
    classMethods: {
      associate: function (models) {
        Ticket.belongsTo(models.User, { foreignKey: 'creator', as: 'creatorInfo' })
        Ticket.belongsTo(models.Station, { foreignKey: 'stationId', as: 'station' })
        Ticket.hasMany(models.TicketUser, { foreignKey: 'ticketId' })
        Ticket.hasMany(models.TicketUser, { foreignKey: 'ticketId', as: 'users' })
      }
    },
    defaultScope: {
      where: {
        status: 0
      }
    },
    scopes: {
      deleted: {
        status: -1
      },
      used: {
        status: 1
      }

    }
  })

  return Ticket
}
