/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tokenService.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/29 15:40:04 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 15:40:08 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('../lib/jwt')
const WechatService = require('./wechatService')
const { User } = require('../models')

/**
 * This is wechat service.
 * @class TokenService
 */
class TokenService {
  /**
   * @param {String} userId - user uuid
   * @return {object} token
   */
  async getToken(userId) {
    const { ctx } = this
    const user = await ctx.model.User.findOne({ _id: userId })
    const userData = {
      id: user._id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
    }
    const token = { user: userData }
    return {
      user: userData,
      token: jwt.encode(token),
    }
  }
	/**
	 * web, mobile 获取 token
	 * 若没有该用户 create new user and return token
	 * @param {String} platform - web, mobile
	 * @param {String} code - code
	 * @return {Object} token
	 * @memberof TokenService
	 */
  async oauth2(platform, code) {
    // wechatInfo: {
    // 	openid: 'ogv9iv0DstjP3OGsVl0Y0-jigwbE',
    // 	nickname: 'mosaic',
    // 	sex: 1,
    // 	language: 'en',
    // 	city: 'Nanjing',
    // 	province: 'Jiangsu',
    // 	country: 'CN',
    // 	headimgurl: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaELMY20dSuicj4uXzO4ok9mu7Zvkh27IgomrfE65pBNV4K98NclHDfEurHUou2Yhm2CjLHXfE7amndQ/0',
    // 	privilege: [],
    // 	unionid: 'oOMKGwt3tX67LcyaG-IPaExMSvDw'
    // }
    const wechatService = new WechatService(platform)
    const wechatInfo = await wechatService.oauth2UserInfo(platform, code)
    const conditions = { unionId: wechatInfo.unionid }
    const update = {
      unionId: wechatInfo.unionid,
      nickName: wechatInfo.nickname,
      avatarUrl: wechatInfo.headimgurl,
    }
    const options = { upsert: true }
    const user = await User.findOneAndUpdate(conditions, update, options)

    const userData = {
      id: user._id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
    }
    const token = { user: userData }
    return {
      user: userData,
      token: jwt.encode(token),
    }
  }
	/**
	 * 小程序获取 token
	 * if no user, create new user and return token
	 * @param {String} code - code
	 * @param {String} iv - iv
	 * @param {String} encryptedData - data need to encrypted
	 * @return {Object} token
	 */
  async mpToken(code, iv, encryptedData) {
    // userInfo: {
    // 	"nickName": "Band",
    // 	"gender": 1,
    // 	"language": "zh_CN",
    // 	"city": "Guangzhou",
    // 	"province": "Guangdong",
    // 	"country": "CN",
    // 	"avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
    // 	"unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
    // 	"watermark": {
    // 		"timestamp": 1477314187,
    // 		"appid": "wx4f4bc4dec97d474b"
    // 	}
    // }
    const wechatService = new WechatService('mp')
    const wechatInfo = await wechatService.mpUserInfo(code, iv, encryptedData)
    const conditions = { unionId: 'oOMKGwgcl2HoJgiGZ-BxDFW3GW1E' || wechatInfo.unionid }
    const update = {
      unionId: wechatInfo.unionId,
      nickName: wechatInfo.nickName,
      avatarUrl: wechatInfo.avatarUrl,
    }
    const options = { upsert: true }
    const user = await User.findOneAndUpdate(conditions, update, options)

    const userData = {
      id: user._id,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
    }
    const token = { user: userData }
    return {
      user: userData,
      token: jwt.encode(token),
    }
  }
}

module.exports = new TokenService()
