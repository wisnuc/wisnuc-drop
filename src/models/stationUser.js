/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationUser.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/06 15:43:14 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/06 15:43:47 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


module.exports = function (sequelize, DataTypes) {
	let StationUser = sequelize.define('StationUser', {
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
		tableName: 'station_user',
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
				StationUser.belongsTo(models.User, {foreignKey: 'userId'})
				StationUser.belongsTo(models.Station, {foreignKey: 'stationId'})
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

	return StationUser
}
