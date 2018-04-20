/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wxBizDataCrypt.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/12 14:45:53 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/19 15:56:43 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const crypto = require('crypto')

/**
 * wechat data crypt
 * @class wxBizDataCrypt
 */
class wxBizDataCrypt {
  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }
  /**
	 * 解密算法
	 * @param {any} encryptedData - encryptedData
	 * @param {any} iv - iv
	 * @return {object} decoded data
	 * @memberof WXBizDataCrypt
	 */
  decryptData(encryptedData, iv) {
    // base64 decode
    const sessionKey = new Buffer(this.sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')
    let decoded
    try {
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error('Illegal Buffer')
    }
    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }
    return decoded
  }
}

module.exports = wxBizDataCrypt
