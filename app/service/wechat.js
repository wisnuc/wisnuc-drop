/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wechat.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/24 14:01:22 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 15:29:38 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const rp = require('request-promise')

const wxBizDataCrypt = require('../lib/wxBizDataCrypt')

const BASE_URL = 'https://api.weixin.qq.com'

/**
* 错误时返回JSON数据包(示例为Code无效)
{
  "errcode": 40029,
  "errmsg": "invalid code"
}
若用户取 user info，再验证 access token 是否失效
失效则从新发起登录验证，否则直接返回
returns {"errcode": 0,"errmsg": "ok }
* @class WechatInfo
*/
class WechatService extends Service {

  constructor(ctx) {
    super(ctx)
    this.WECHAT_CONFIG = ctx.config.wechat
  }

  /**
   * 获取 access_token
   * @param {String} code - code
   * @return {Promise} accessToken
   * @memberof WechatService
   */
  async accessToken(code) {
    const options = {
      url: `${BASE_URL}/sns/oauth2/access_token`,
      qs: {
        appid: this.WECHAT_CONFIG.appid,
        secret: this.WECHAT_CONFIG.appSecret,
        code,
        grant_type: 'authorization_code',
      },
    }
    return await rp(options)
  }

  /**
   * 刷新 access_token 有效期
   * @param {String} refreshToken - refreshToken
   * @return {Promise} refreshToken
   * @memberof WechatService
   */
  async refreshToken(refreshToken) {
    const options = {
      url: `${BASE_URL}/sns/oauth2/refresh_token`,
      qs: {
        appid: this.WECHAT_CONFIG.appid,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    }
    return await rp(options)
  }

  /**
   * 检验授权凭证（access_token）是否有效
   * @param {String} access_token - accessToken
   */
  checkToken() { }

  /**
   * get wechat user information
   * @param {String} accessToken - accessToken
   * @param {String} openid - openid
   * @return {Promise} userInfo
   * @memberof WechatService
   */
  async userInfo(accessToken, openid) {
    const options = {
      url: `${BASE_URL}/sns/userinfo`,
      qs: {
        openid,
        access_token: accessToken,
      },
    }
    return await rp(options)
  }

  /**
   * get wechat user information
   * @param {String} type - type
   * @param {String} code - code
   * @return {Promise} userInfo
   * @memberof WechatService
   */
  async oauth2UserInfo(type, code) {
    const { refresh_token, openid } = await this.accessToken(code)
    const { access_token } = await this.refreshToken(refresh_token)
    const userInfo = await this.userInfo(access_token, openid)
    return userInfo
  }

  /**
   * get session key
   * @param {String} code - code
   * @return {Promise} SessionKey
   * @memberof WechatService
   */
  async getSessionKey(code) {
    const options = {
      url: `${BASE_URL}/sns/jscode2session`,
      qs: {
        appid: this.WECHAT_CONFIG.appid,
        secret: this.WECHAT_CONFIG.appSecret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    }
    // {
    //   "openid": "OPENID",
    //   "session_key": "SESSIONKEY"
    // }
    return await rp(options)
  }

  /**
   * 通过小程序，获取用户信息
   * @param {String} code - code
   * @param {String} iv - iv
   * @param {String} encryptedData - encryptedData
   * @return {Promise} userInfo
   * @memberof WechatService
   */
  async mpUserInfo(code, iv, encryptedData) {
    const data = await this.getSessionKey(code)
    const pc = new wxBizDataCrypt(this.WECHAT_CONFIG.appid, data.session_key)
    const mpUserInfo = pc.decryptData(encryptedData, iv)
    // mpUserInfo: {
    //   "nickName": "Band",
    //   "gender": 1,
    //   "language": "zh_CN",
    //   "city": "Guangzhou",
    //   "province": "Guangdong",
    //   "country": "CN",
    //   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
    //   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
    //   "watermark": {
    //     "timestamp": 1477314187,
    //     "appid": "wx4f4bc4dec97d474b"
    //   }
    // }
    return mpUserInfo
  }
}

module.exports = WechatService
