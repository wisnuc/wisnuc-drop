/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user.test.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/05/28 11:34:58 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/28 18:15:16 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const { app, assert } = require('egg-mock/bootstrap')
const BASE_URL = '/c/v1'

describe('test/app/controller/c/user.test.js', () => {
  const userId = 'c4d249dd-ed57-4655-9497-2a93ae3af1d0'
  let ctx,
    mockUser,
    cToken

  before(async () => {
    ctx = await app.mockContext()
    cToken = await ctx.service.token.getToken(userId)
    mockUser = async () => {
      await ctx.service.user.create({
        _id: userId,
        unionId: 'oOMKGwt3tX67LcyaG-IPaExMSvDw',
        status: 1,
        nickName: 'mosaic',
        avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epetUHR5HCOBJTl1fon9e7zDIk93UpRsicWLYYhIbaSFYpRdhszp5yiaUbzolia4gdeZnKjLXlEmAicFA/132',
        stations: [ '4303984e-6f32-422b-8eda-11a050a1dd37' ],
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
      .set('Authorization', cToken)
      .expect(404)
    await mockUser()
    console.log(cToken);
    await app
      .httpRequest()
      .get(`${BASE_URL}/users/${userId}`)
      .expect(200)
    return
  })

  after(async () => {
    // delete mock data
  })
})
