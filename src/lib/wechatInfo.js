/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wechatInfo.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/24 14:01:22 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/03/28 11:47:27 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const request = require('request')
const config = require('getconfig')

const BASE_URL = 'https://api.weixin.qq.com'
const WXBizDataCrypt = require('../lib/WXBizDataCrypt')

/**
  错误时返回JSON数据包(示例为Code无效)
	{
    "errcode": 40029,
    "errmsg": "invalid code"
	}
	若用户取 user info，再验证 access token 是否失效
	失效则从新发起登录验证，否则直接返回
	returns {"errcode": 0,"errmsg": "ok }
 * @class WechatInfo
 */
class WechatInfo {

  constructor(type) {
    this.CONFIG = config.wechat[type]
  }

	/**
	 * get access token 
	 * @param {string} code
	 * @param {function} callback
	 * @returns {object} accessToken    
	 */
  accessToken(code, callback) {
    let url = BASE_URL + '/sns/oauth2/access_token?' +
      'appid=' + this.CONFIG.appid +
      '&secret=' + this.CONFIG.appSecret +
      '&code=' + code +
      '&grant_type=authorization_code'

    request({
      method: 'GET',
      uri: url
    },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body)
          if (data && data.errcode) {
            callback(data.errmsg)
          }
          else {
            callback(null, data)
          }
        }
        else {
          callback(error)
        }
      })
  }

	/**
	 * 刷新access_token有效期
	 * @param {*} callback 
	 * @param {string} refreshToken
	 */
  refreshToken(refreshToken, callback) {
    let url = BASE_URL + '/sns/oauth2/refresh_token?' +
      'appid=' + this.CONFIG.appid +
      '&grant_type=refresh_token' +
      '&refresh_token=' + refreshToken

    request({
      method: 'GET',
      uri: url
    },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body)
          if (data && data.errcode) {
            callback(data.errmsg)
          }
          else {
            callback(null, data)
          }
        }
        else {
          callback(error)
        }
      })
  }

	/**
	 * 检验授权凭证（access_token）是否有效
	 * @param {*} access_token 
	 * @param {*} openid 
	 */
  checkToken() { }

	/**
	 * get wechat user information
	 * @param {string} accessToken
	 * @param {string} openid
	 * @param {function} callback
	 */
  userInfo(accessToken, openid, callback) {
    let url = BASE_URL + '/sns/userinfo?' +
      'access_token=' + accessToken +
      '&openid=' + openid

    request({
      method: 'GET',
      uri: url
    },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body)
          if (data && data.errcode) {
            callback(data.errmsg)
          }
          else {
            callback(null, data)
          }
        }
        else {
          callback(error)
        }
      })
  }

	/**
	 * get wechat user information
	 * @param {string} code
	 * @param {function} callback
	 * @returns {object} userInfo 
	 */
  oauth2UserInfo(type, code, callback) {
    let _this = this
    _this.accessToken(code, function (error, data) {
      if (error)
        return callback(error)

      _this.refreshToken(data.refresh_token, function (err, refresh) {
        if (err)
          return callback(err)

        _this.userInfo(refresh.access_token, data.openid, function (er, userInfo) {
          if (er)
            return callback(er)

          callback(null, userInfo)
        })
      })

    })
  }

  async oauth2UserInfoAsync(platform, code) {
    return Promise.promisify(this.oauth2UserInfo).bind(this)(platform, code)
  }

	/**
 * @param {string} code
 * @param {function} callback
 * @returns {object} data {
		"openid": "OPENID",
		"session_key": "SESSIONKEY"
	}
 */
  getSessionKey(code, callback) {
    let url = BASE_URL +
      '/sns/jscode2session?' +
      'appid=' + this.CONFIG.appid +
      '&secret=' + this.CONFIG.appSecret +
      '&js_code=' + code +
      '&grant_type=authorization_code'
    request({
      method: 'GET',
      uri: url
    },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body)
          if (data && data.errcode) {
            callback(data.errmsg)
          }
          else {
            callback(null, data)
          }
        }
        else {
          callback(error)
        }
      })
  }

	/**
	 * 获取小程序信息
	 * @param {*} code 
	 * @param {*} iv 
	 * @param {*} encryptedData
	 * @param {*} callback 
	 * @returns {object} userInfo - {
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
  mpUserInfo(code, iv, encryptedData, callback) {
    this.getSessionKey(code, (err, result) => {
      if (err)
        return callback(err)
      let pc = new WXBizDataCrypt(this.CONFIG.appid, result.session_key)
      let data = pc.decryptData(encryptedData, iv)

      return callback(null, data)
    })
  }

  async mpUserInfoAsync(code, iv, encryptedData) {
    return Promise.promisify(this.mpUserInfo).bind(this)(code, iv, encryptedData)
  }
}


module.exports = WechatInfo
