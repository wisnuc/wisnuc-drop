/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tokenService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/09 18:10:53 by Jianjin Wu          #+#    #+#             */
/*   Updated: 2017/08/09 18:11:04 by Jianjin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')
const WechatInfo = require('../lib/wechatInfo')
const { User, WisnucDB } = require('../models')
/**
 * This is wechat service.
 * @class TokenService
 */
class TokenService {
	/**
	 * web, mobile 登录
	 * 若没有该用户 create new user and return token
	 * @param {string} platform  
	 * @param {string} code 
	 * @returns {object} token
	 * @memberof TokenService
	 */
  async oauth2(platform, code) {
		/**
		userInfo: {
			openid: 'ogv9iv0DstjP3OGsVl0Y0-jigwbE',
			nickname: 'mosaic',
			sex: 1,
			language: 'en',
			city: 'Nanjing',
			province: 'Jiangsu',
			country: 'CN',
			headimgurl: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaELMY20dSuicj4uXzO4ok9mu7Zvkh27IgomrfE65pBNV4K98NclHDfEurHUou2Yhm2CjLHXfE7amndQ/0',
			privilege: [],
			unionid: 'oOMKGwt3tX67LcyaG-IPaExMSvDw'
		}
		 */
    return WisnucDB.transaction(async t => {
      let wechatInfo = new WechatInfo(platform)
      let userInfo = await wechatInfo.oauth2UserInfoAsync(platform, code)
      let user
      user = await User.find({
        where: {
          unionId: userInfo.unionid
        },
        raw: true,
        transaction: t
      })
      if (!user) {
        // user not exist, create new user
        user = await User.create({
          unionId: userInfo.unionid,
          nickName: userInfo.nickname,
          avatarUrl: userInfo.headimgurl
        }, { transaction: t })
      }
      else {
        // update nickName, avatarUrl
        await User.update({
          nickName: userInfo.nickname,
          avatarUrl: userInfo.headimgurl
        }, {
          where: {
            unionId: userInfo.unionid
          }, transaction: t
        })
      }
      const userData = {
        id: user.id,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl
      }
      const token = { user: userData }
      return {
        user: userData,
        token: jwt.encode(token)
      }
    })

  }

	/**
	 * mp 登录
	 * if no user, create new user and return token
	 * @param {*} code 
	 * @param {*} iv 
	 * @param {*} encryptedData 
	 * @returns {object} token
	 */
  async mpToken(code, iv, encryptedData) {
		/**
	  userInfo: {
			"nickName": "Band",
			"gender": 1,
			"language": "zh_CN",
			"city": "Guangzhou",
			"province": "Guangdong",
			"country": "CN",
			"avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
			"unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
			"watermark": {
				"timestamp": 1477314187,
				"appid": "wx4f4bc4dec97d474b"
			}
		}
		 */
    return WisnucDB.transaction(async t => {
      const wechatInfo = new WechatInfo('mp')
      let userInfo = await wechatInfo.mpUserInfoAsync(code, iv, encryptedData)
      let user
      user = await User.find({
        where: {
          unionId: userInfo.unionId
        },
        raw: true,
        transaction: t
      })
      if (!user) {
        // user not exist, create new user
        user = await User.create({
          unionId: userInfo.unionId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }, { transaction: t })
      }
      else {
        // update nickName, avatarUrl
        await User.update({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }, {
          where: {
            unionId: userInfo.unionId
          }, transaction: t
        })
      }
      const userData = {
        id: user.id,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl
      }
      const token = { user: userData }
      return {
        user: userData,
        token: jwt.encode(token)
      }
    })
  }
}

module.exports = new TokenService()
