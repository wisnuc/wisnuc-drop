/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/28 10:14:00 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/26 18:22:39 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
	let Ticket = sequelize.define('Ticket', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID, 
			defaultValue: DataTypes.UUIDV4
		},
		// creator == undefinded, when type == bind
		creator:  DataTypes.STRING,
		
		// invite, bind, share
		type: {
			type: DataTypes.STRING,
			required: true
		},
		stationId: {
			type: DataTypes.UUID,
			required: true
		},
		data: DataTypes.TEXT,
		// -1 失效 0 未消费 1 已使用
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 0 // default 0
		},
		createdAt: {
			type: DataTypes.DATE,
			get: function() {
				return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
			}
		},
		updatedAt: {
			type: DataTypes.DATE,
			get: function() {
				return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	}, {
		freezeTableName: true,
		tableName: 'tickets',
		indexes: [
			{
				name: 'creator',
				method: 'BTREE',
				fields: ['creator']
			}
		],
		classMethods: {
			associate: function (models) {
				Ticket.hasMany(models.TicketUser, {foreignKey: 'ticketId'})
				Ticket.hasMany(models.TicketUser, {foreignKey: 'ticketId',as: 'users'})
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
