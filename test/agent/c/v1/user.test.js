/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.test.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/06/08 17:01:56 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/06 13:39:23 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const path = require('path') 
const assert = require('power-assert')
const request = require('supertest')
const app = require('src/app')

const { User } = require('src/models')
const tokenService = require('src/services/tokenService')

const { USERS, STATIONS } = require('../../lib')

let user
let cToken 

describe(path.basename(__filename), () => {
  describe('no client token', () => {
    it('should fail auth if no client token', done => {
      request(app)
        .get('/c/v1/users/c4d249dd-ed57-4655-9497-2a93ae3af1d0')
        .expect(401)
        .end(done)
    })
  })

  describe('have client token', () => {
    before(async () => {
      // create user
      user = await User.create(USERS['mosaic'])
      const data = await tokenService.getToken(user._id)
      cToken = data.token
    })

    after(async () => {
      // delete user
      await User.deleteOne({ _id: user._id })
    })

    it('get user', done => {
      request(app)
        .get(`/c/v1/users/${user._id}`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get stations', done => {
      request(app)
        .get(`/c/v1/users/${user._id}/stations`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get interestingPersons', done => {
      request(app)
        .get(`/c/v1/users/${user._id}/interestingPerson`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })

    it('get interestingPerson', done => {
      request(app)
        .get(`/c/v1/users/${user._id}/interesting/personId`)
        .set('Authorization', cToken)
        .expect(200)
        .end(done)
    })
  })
})
