/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   users.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 16:53:59 by JianJin Wu       ###   ########.fr       */
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
const { User } = require('src/models')
const {
	USERS,
  STATIONS,
  cToken
} = require('../../lib')

const user = USERS['mosaic']

describe(path.basename(__filename), () => {

  describe('no client token', () => {
    it('should fail auth if no client token', done => {
      request(app)
        .get(`/c/v1/users/${user.id}`)
        .expect(401)
        .end(done)
    })
  })

  describe('have client token', () => {

    before(async () => {
      // create new user
      await User.create(user)
      // await resetAsync()
    })

    after(async () => {
      // delete user
      await User.destroy({
        where: {
          id: user.id
        }
      })
    })

    it('get user', done => {
      request(app)
        .get(`/c/v1/users/${user.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('update user', done => {
      request(app)
        .patch(`/c/v1/users/${user.id}`)
        .send({ nickName: 'test', avatarUrl: 'http://www.wisnuc.com' })
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('delete user', done => {
      request(app)
        .delete(`/c/v1/users/${user.id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get stations', done => {
      request(app)
        .get(`/c/v1/users/${user.id}/stations`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get friends', done => {
      request(app)
        .get(`/c/v1/users/${user.id}/friends`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

  })
})
