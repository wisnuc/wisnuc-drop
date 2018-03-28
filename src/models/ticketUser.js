/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticketUser.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/13 11:02:04 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/28 11:49:47 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = function (sequelize, DataTypes) {
  let TicketUser = sequelize.define('TicketUser', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    ticketId: {
      type: DataTypes.UUID,
      required: true
    },
    userId: {
      type: DataTypes.UUID,
      required: true
    },
    password: {
      type: DataTypes.STRING
    },
    // pending, reject, resolve
    type: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    // -1: 失效  1: 正常
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    freezeTableName: true,
    tableName: 'ticket_user',
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
        name: 'ticketId',
        method: 'BTREE',
        fields: ['ticketId']
      }
    ],
    classMethods: {
      associate: function (models) {
        TicketUser.belongsTo(models.User, { foreignKey: 'userId' })
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

  return TicketUser
}
