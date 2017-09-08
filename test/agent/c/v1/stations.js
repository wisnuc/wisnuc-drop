/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/07 09:42:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/08 18:03:47 by JianJin Wu       ###   ########.fr       */
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

const {Station} = require('src/models')

const {
	USER,
	STATION,
	clientToken
} = require('../../lib')


describe(path.basename(__filename), () => {

	describe('no client token', () => {

		it('should fail auth if no client token', done => {
			request(app)
				.get(`/c/v1/stations/${STATION.id}`)
				.expect(401)
				.end(done)
		})
	})

	describe('have client token', () => {
			
		beforeEach(async () => {
			await Station.create(STATION)
		})

		afterEach(async () => {
			await Station.destroy({
				where: {
					id: STATION.id
				}
			})
		})
				
		it('get station', done => {
			request(app)
				.get(`/c/v1/stations/${STATION.id}`)
				.set('Authorization', clientToken)
				.expect(200)
				.end(done)
		})

		it('update station', done => {
			request(app)
				.patch(`/c/v1/stations/${STATION.id}`)
				.set('Authorization', clientToken)
				.send({name: 'name_test'})
				.expect(200)
				.end(done)
		})

		it('delete station', done => {
			request(app)
				.delete(`/c/v1/stations/${STATION.id}`)
				.set('Authorization', clientToken)
				.expect(200)
				.end(done)
		})

		it('get users', done => {
			request(app)
				.get(`/c/v1/stations/${STATION.id}/users`)
				.set('Authorization', clientToken)
				.expect(200)
				.end(done)
		})
	})
})
