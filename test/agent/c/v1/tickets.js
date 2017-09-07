/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tickets.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/14 14:39:37 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/01 17:48:03 by JianJin Wu       ###   ########.fr       */
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
const app = require('../../../src/app')

const { resetAsync } = require('../lib')

const TICKET = {
	id: '76397be6-92c5-4cd2-9542-ee66bd65ab07'
}

// describe(path.basename(__filename), () => {


// 	describe('no token', () => {

// 		beforeEach(async () => {
// 			// await resetAsync()
// 		})

// 		it('should return error if no client token', done => {
// 			request(app)
// 				.get('/v1/tickets')
// 				.expect(401)
// 				.end(done)
// 		})
// 	})

// 	describe('have station', () => {

// 		beforeEach(async () => {

// 		})

// 		it('POST /v1/tickets - create new ticket', done => {
// 			request(app)
// 				.post('/v1/tickets')
// 				.send({
// 					id: TICKET.id
// 				})
// 				.set('Accept', 'application/json')
// 				.expect('Content-Type', /json/)
// 				.expect(200, done)
// 		})

// 		it('GET /v1/tickets/:id - get one user', done => {
// 			request(app)
// 				.get('/v1/users' + TICKET.id)
// 				.set('Accept', 'application/json')
// 				.expect('Content-Type', /json/)
// 				.expect(200, done)
// 		})

// 		afterEach(async () => {

// 		})
// 	})
// })
