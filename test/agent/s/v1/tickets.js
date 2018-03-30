/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tickets.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/14 14:39:37 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const path = require('path')
const request = require('supertest')
const app = require('src/app')

const {
	Ticket,
  Station,
  User
 } = require('src/models')
const {
	TICKETS,
  USERS,
  STATIONS,
  cToken,
  resetAsync
} = require('../../lib')

const bindTicket = TICKETS['bind']
const inviteTicket = TICKETS['invite']
const shareTicket = TICKETS['share']
const user = USERS['mosaic']
const station = STATIONS['station_1']

describe(path.basename(__filename), () => {


  describe('no client token', () => {
    it('should fail auth if no client token', done => {
      request(app)
        .get(`/c/v1/tikcets/${bindTicket.id}`)
        .expect(401)
        .end(done)
    })
  })

  describe('bind flow - have client token', () => {

    before(async () => {
      // await resetAsync()
      bindTicket.stationId = station.id
      await User.create(user)
      await Ticket.create(bindTicket)

      // return request(app)
      // 	.post('/c/v1/tikcets')
      // 	.send({
      // 		type: 'bind',
      // 		stationId: station.id,
      // 		data: '123456'
      // 	})
      // 	.set('Authorization', cToken)
      // 	.expect(200)
      // 	.end((err, res) => {
      // 		console.log(11111,err,res);
      // 	})
    })
    after(async () => {
      await Ticket.destroy({
        where: {
          id: bindTicket.id
        }
      })
      await User.destroy({
        where: {
          id: user.id
        }
      })
    })

    it('get ticket', done => {
      request(app)
        .get(`/c/v1/tickets/${bindTicket.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get tickets', done => {
      request(app)
        .get(`/c/v1/tickets`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('fill ticket', done => {
      request(app)
        .post(`/c/v1/tickets/${bindTicket.id}/users`)
        .set('Authorization', cToken)
        .send({ password: '123456' })
        .expect(200)
        .end(done)
    })

    it('get user', done => {
      request(app)
        .get(`/c/v1/tickets/${bindTicket.id}/users/${user.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get users', done => {
      request(app)
        .get(`/c/v1/tickets/${bindTicket.id}/users`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

  })

})
