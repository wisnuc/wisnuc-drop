/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/07 09:42:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/11 11:14:12 by JianJin Wu       ###   ########.fr       */
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
	STATIONS,
	cToken
} = require('../../lib')

const station = STATIONS['station_1']

describe(path.basename(__filename), () => {

	describe('no client token', () => {

		it('should fail auth if no client token', done => {
			request(app)
				.get(`/c/v1/stations/${station.id}`)
				.expect(401)
				.end(done)
		})
	})

	describe('have client token', () => {
			
		before(async () => {
			await Station.create(station)
		})

		after(async () => {
			await Station.destroy({
				where: {
					id: station.id,
					status: -1 
				}
			})
		})
				
		it('get station', done => {
			request(app)
				.get(`/c/v1/stations/${station.id}`)
				.set('Authorization', cToken)
				.expect(200)
				.end(done)
		})

		it('update station', done => {
			request(app)
				.patch(`/c/v1/stations/${station.id}`)
				.set('Authorization', cToken)
				.send({name: 'name_test'})
				.expect(200)
				.end(done)
		})

		it('delete station', done => {
			request(app)
				.delete(`/c/v1/stations/${station.id}`)
				.set('Authorization', cToken)
				.expect(200)
				.end(done)
		})

		it('get users', done => {
			request(app)
				.get(`/c/v1/stations/${station.id}/users`)
				.set('Authorization', cToken)
				.expect(200)
				.end(done)
		})
	})
})
