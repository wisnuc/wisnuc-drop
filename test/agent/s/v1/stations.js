/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stations.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/07 09:42:34 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 16:54:02 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const path = require('path')
const _ = require('lodash')
const request = require('supertest')
const app = require('src/app')

const { Station } = require('src/models')
const {
	STATIONS,
  USERS,
  cToken
} = require('../../lib')

const station = STATIONS['station_1']
const userIds = _.map(USERS, 'id').toString()

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

    describe('create new station', () => {
      it('create new station', done => {
        request(app)
          .post(`/s/v1/stations`)
          .set('Authorization', cToken)
          .send({ name: 'name_test', publicKey: 'test' })
          .expect(200)
          .end(async (err, res) => {
            let data = res.body.data
            await Station.destroy({ where: { id: data.id } })
            done()
          })
      })
    })

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
        .get(`/s/v1/stations/${station.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('update station', done => {
      request(app)
        .patch(`/s/v1/stations/${station.id}`)
        .set('Authorization', cToken)
        .send({ name: 'name_test', userIds: userIds })
        .expect(200)
        .end(done)
    })

    it('delete station', done => {
      request(app)
        .delete(`/s/v1/stations/${station.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get users', done => {
      request(app)
        .get(`/s/v1/stations/${station.id}/users`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })
  })
})
