/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WXBizDataCrypt.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/12 14:45:53 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:46:19 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const crypto = require('crypto')

/**
 * wechat data crypt
 * @class WXBizDataCrypt
 */
class WXBizDataCrypt {
  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }
	/**
	 * 解密算法
	 * @param {any} encryptedData 
	 * @param {any} iv 
	 * @return {object} decoded data
	 * @memberof WXBizDataCrypt
	 */
  decryptData(encryptedData, iv) {
    // base64 decode
    var sessionKey = new Buffer(this.sessionKey, 'base64')
    encryptedData = new Buffer(encryptedData, 'base64')
    iv = new Buffer(iv, 'base64')

    try {
      // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
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

module.exports = WXBizDataCrypt
