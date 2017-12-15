/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   accountService.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/06 10:36:37 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 15:41:06 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const { User } = require('../models')

const jwt = require('../lib/jwt')
const WechatInfo = require('../lib/wechatInfo')

/**
 * This is account resource.
 * @class AccountService
 */
class AccountService {
	/**
	 * binding wechat account
	 * 1. if this wechat user don`t exist, create new global user.
	 * 2. fill ticket that about binding type.
	 * 3. return ticket id
	 * @param {object} user 
	 * @returns 
	 * @memberof AccountService
	 */
  async bindingWechat(platform, code) {

    let wechatInfo = new WechatInfo(platform)
    let userInfo = await wechatInfo.oauth2UserInfoAsync(platform, code)

    let user
    user = await User.find({
      where: {
        unionId: userInfo.unionid
      },
      raw: true
    })

    // user no exist
    if (!user) {
      // create new user
      user = await User.create({
        unionId: userInfo.unionid,
        nickName: userInfo.nickname,
        avatarUrl: userInfo.headimgurl
      })
    }
    const token = { user: user }

    return {
      user: {
        id: user.id,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl
      },
      token: jwt.encode(token)
    }
  }

}

module.exports = new AccountService()
