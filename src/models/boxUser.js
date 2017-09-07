/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   boxUser.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 16:40:40 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/07/03 18:00:49 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

module.exports = function (sequelize, DataTypes) {
	let BoxUser = sequelize.define('BoxUser', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		boxId: {
			type: DataTypes.UUID,
			required: true
		},
		userId: {
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
			tableName: 'box_user',
			indexes: [
				{
					name: 'boxId',
					method: 'BTREE',
					fields: ['boxId']
				},
				{
					name: 'userId',
					method: 'BTREE',
					fields: ['userId']
				}
			],
			classMethods: {
				associate: function (models) {
					BoxUser.belongsTo(models.Box, { foreignKey: 'boxId' })
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

	return BoxUser
}
