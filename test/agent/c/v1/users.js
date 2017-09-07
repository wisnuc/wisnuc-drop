/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const path = require('path')
const uuid = require('uuid')
const chai = require('chai')
// chai.use(require('chai-as-promised'))
const sinon = require('sinon')
const expect = chai.expect
const should = chai.should()
const request = require('supertest')
const app = require('src/app')
const {User} = require('src/models')

// mock
const USER = {
	'id': '03f3abf9-fe3e-4e9b-a6f5-5e53ef9fd1a5',
	'status': 1,
	'password': null,
	'email': null,
	'phoneNO': null,
	'unionId': 'oOMKGwt3tX67LcyaG-IPaExMSvDw',
	'nickName': 'mosaic',
	'avatarUrl': 'http://wx.qlogo.cn/mmopen/PiajxSqBRaELMY20dSuicj4uXzO4ok9mu7Zvkh27IgomrfE65pBNV4K98NclHDfEurHUou2Yhm2CjLHXfE7amndQ/0',
	'createdAt': '2017-07-24T07:31:59.000Z',
	'updatedAt': '2017-07-24T07:31:59.000Z'
}


describe(path.basename(__filename), () => {

	describe('no token', () => {

		beforeEach(async () => {
			// create new user
			await User.create(USER)
			// await resetAsync()
		})

		it('should fail auth if no client token', done => {
			request(app)
				.get('/v1/users/' + USER.id)
				.expect(401)
				.end(done)
		})
	})

	describe('have wehcat token', () => {


		it('GET /users/:id - get user', done => {
			request(app)
				.get('/v1/users/' + USER.id)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done)
		})

		
	})
})
