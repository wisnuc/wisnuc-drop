/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/24 10:53:26 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { sequelize } = require('src/models')

const USER = {
	test: {
		id: '03f3abf9-fe3e-4e9b-a6f5-5e53ef9fd1a5',
		status: 1,
		password: null,
		email: null,
		phoneNO: null,
		unionId: 'oOMKGwt3tX67LcyaG-IPaExMSvDw',
		nickName: 'mosaic',
		avatarUrl: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaELMY20dSuicj4uXzO4ok9mu7Zvkh27IgomrfE65pBNV4K98NclHDfEurHUou2Yhm2CjLHXfE7amndQ/0',
		refreshToken: null,
		accessToken: null,
		createdAt: '2017-07-24T07:31:59.000Z',
		updatedAt: '2017-07-24T07:31:59.000Z'
	}
}

const STATION = {
	test: {
		id: '05245d90-fc9b-42c3-b309-d9a09c58f72b',
		name: 'station_1502071625974',
		status: 1,
		createdAt: '2017-08-07T07:31:59.000Z',
		updatedAt: '2017-08-07T07:31:59.000Z'
	}
}

const FILES = {
  account: {
    name: 'account.md',
    path: 'tmp/account.md',
    size: 103005,
    hash: 'fb3273052fc288683504bb454172ded50802dc4ec068edb43480539ceebdf29b'
	},
	http: {
		name: 'http.pdf',
    path: 'tmp/http.pdf',
    size: 89259239,
    hash: 'c03e5c4367554baa5e12916758b4587dc8d4c1070caba921a7e42ac6dc102af9'
	},
	ubuntu: {
    path: 'tmp/ubuntu.iso',
    size: 4162242560,
    hash: '02aef95802ca66f5b03fa0122ae4aa9ccc584c985e6eaa5f05dc3953f8031db3'
  }
}

module.exports = {
	// async resetAsync() {
	// 	await sequelize.sync({force: true})
	// },
	USER,
	STATION,
	FILES
}
