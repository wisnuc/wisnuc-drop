/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fundebug.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/24 13:58:44 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/03/30 14:49:35 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const fundebug = require('fundebug-nodejs')
const config = require('getconfig')

fundebug.config({
  apikey: '39609f21a72aaa89f25bdd7db2fbe28ad4eabd88242d1be9d62d499f6242ee34',
  slient: false,
  releaseStage: config.env || 'production',
  user: {
    name: 'mosaic',
    email: 'jianjin.wu@winsuntech.cn'
  }
})

module.exports = {

  notify(name, message, option) {
    name ? name : 'Prod'
    message ? message : 'no message'
    fundebug.notify(name, message, option)
  },

  notifyError(err, option) {
    if (err && err instanceof Error) {
      fundebug.notifyError(err, option)
    }
  }
}
