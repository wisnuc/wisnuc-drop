/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stationServer.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/16 14:28:37 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
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
		status: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		}
	}, {
		freezeTableName: true,
		tableName: 'station_server',
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
	return StationServer
}
