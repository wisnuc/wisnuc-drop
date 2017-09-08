/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationServer.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/16 14:28:37 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/08 16:10:54 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = function (sequelize, DataTypes) {
	let StationServer = sequelize.define('StationServer', {

		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		stationId: {
			type: DataTypes.UUID,
			required: true
		},
		serverId: {
			type: DataTypes.UUID,
			required: true
		},
		// 0: 离线, 1: 在线
		isOnline: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		}
	}, {
		freezeTableName: true,
		tableName: 'station_server',
		indexes: [
			{
				name: 'stationId',
				method: 'BTREE',
				fields: ['stationId']
			},
			{
				name: 'serverId',
				method: 'BTREE',
				fields: ['serverId']
			}
		],
		classMethods: {
			associate: function (models) {
				StationServer.belongsTo(models.Server, {foreignKey: 'serverId'})
				StationServer.belongsTo(models.Station, {foreignKey: 'stationId'})
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
	return StationServer
}
