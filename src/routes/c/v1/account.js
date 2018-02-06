/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   account.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/06 10:29:56 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/06 15:50:57 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// don`t follow the rule of restful
const express = require('express')
const router = express.Router()

// wechat test api
router.post('/', async (req, res) => {
  try {
    return res.success()
  }
  catch (err) {
    return res.error(err)
  }
})

module.exports = router

