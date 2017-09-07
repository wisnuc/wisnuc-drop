/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/07 09:42:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/01 17:47:38 by JianJin Wu       ###   ########.fr       */
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
const jwt = require('src/lib/jwt')

const {
	USER,
	STATION,
	FILES
} = require('../lib')

const USER_TOKEN = jwt.encode(USER['test'])
const STATION_TOKEN = jwt.encode(STATION['test'])


// describe(path.basename(__filename), () => {

// 	describe('no user token', () => {

// 		beforeEach(async () => {
// 			// await resetAsync()
// 		})

// 		it('should fail auth if no user token', done => {
// 			request(app)
// 				.get('/v1/stations')
// 				.expect(401)
// 				.end(done)
// 		})
// 	})

// 	describe('have user token', () => {

// 		it('POST .../pipe - store new pipe', done => {
			
// 			this.timeout(0)
			
// 			request(app)
// 				.post(`/v1/stations/${STATION.test.id}/pipe`)
// 				.set('authorization', STATION_TOKEN)
// 				.attach('account', 'tmp/account.md', 'account')
// 				.expect(200)
// 				.end((err, res) => {
// 					console.log(err, res.data);
// 					done()
// 				})
// 		})

// 	})
// })
