/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   station.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/07 17:15:58 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/06/09 11:49:52 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
	let Station = sequelize.define('Station', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			defaultValue: 'station_' + Date.now()
		},
		publicKey: {
			type: DataTypes.TEXT,
			unique: true
		},
		// -1: 失效, 1: 正常
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		// 0: 离线, 1: 在线
		isOnline: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		serverId: {
			type: DataTypes.UUID,
			required: true,
			unique: true
		},
		userIds: {
			type: DataTypes.STRING
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
		tableName: 'stations',
		indexes: [
			{
				name: 'isOnline',
				method: 'BTREE',
				fields: ['isOnline']
			},
			{
				name: 'name',
				method: 'BTREE',
				fields: ['name']
			}
		],
		classMethods: {
			associate: function (models) {
				Station.hasMany(models.UserStation, {foreignKey: 'stationId'})
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

	return Station
}
