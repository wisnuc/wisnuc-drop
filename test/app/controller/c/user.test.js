/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.test.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/05/28 11:34:58 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 14:14:13 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const { app, assert } = require('egg-mock/bootstrap')
const BASE_URL = '/c/v1'

describe('test/app/controller/c/user.test.js', () => {
  const userId = 'c4d249dd-ed57-4655-9497-2a93ae3af1d0'
  let ctx,
    user,
    mockToken,
    mockUser,
    fakeUser,
    cToken

  before(async () => {
    ctx = await app.mockContext()
    mockToken = async () => {
      const getToken = await ctx.service.token.getToken(userId)
      cToken = getToken.token
      console.log(cToken);
    }
    mockUser = async () => {
      user = await ctx.service.user.create({
        _id: userId,
        unionId: 'oOMKGwt3tX67LcyaG-IPaExMSvDw',
        status: 1,
        nickName: 'mosaic',
        avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epetUHR5HCOBJTl1fon9e7zDIk93UpRsicWLYYhIbaSFYpRdhszp5yiaUbzolia4gdeZnKjLXlEmAicFA/132',
        stations: [ '4303984e-6f32-422b-8eda-11a050a1dd37', '4303984e-6f32-422b-8eda-11a050a1dd36' ],
      })
    }
  })

  // it('should assert', async () => {
  //   const pkg = require('../../../../package.json')
  //   assert(app.config.keys.startsWith(pkg.name))

  //   const ctx = await app.mockContext({})
  //   // yield ctx.service.xx();
  // })

  it('should GET /users/:id ok', async () => {
    await app
      .httpRequest()
      .get(`${BASE_URL}/users/${userId}`)
      .expect(401)
    await mockUser()
    await mockToken()
    const rs = await app
      .httpRequest()
      .get(`${BASE_URL}/users/${userId}`)
      .set('authorization', cToken)
      .expect(200)
    assert(JSON.parse(rs.text).data._id === userId)
  })

  // should GET /users/:id/stations ok
  // should GET /users/:userId/interestingPerson ok
  // should GET /users/:userId/interesting/personId ok

  // after(async () => {
  //   // delete mock data
  //   await ctx.model.User.deleteOne({ _id: userId })
  // })
})
