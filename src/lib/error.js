/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   error.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/05 17:17:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/07 16:27:24 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


const logger = global.Logger(__filename)
const E = {}



let Code = {
	200: 'ok',
	400: 'invalid parameters',
	401: 'Authentication failed',
	403: 'forbidden', // 
	404: 'not found', 
	500: 'system error'
}


// generate function
const EClass = (code, message) => {
  return class extends Error {
    constructor(m = message) {
      super(m)
      this.code = code
    }
  }
}

const define = (name, code, message) => E[name] = EClass(code, message)


/**
 * Error Code
 * such as: 60001，固定长度为5位整数！ 
 * 6 											 00 		     01
 * 服务级错误（1为系统级错误）	服务模块代码	具体错误代码
 */
// user: 600XX
define('UserNotExist',     60001, 'user not exist')
define('UserAlreadyExist', 60002, 'user already exist')
// station: 601XX
define('StationNotExist',     60101, 'station not exist')
define('StationAlreadyExist', 60102, 'station already exist')
// ticket: 602XX
define('TicketNotExist',       60201, 'ticket not exist')
define('TicketAlreadyExist',   60202, 'ticket already exist')
define('TicketAlreadyExpired', 60203, 'ticket already expired')
// ticket_user
define('TicketAlreadyHaveUser', 60204, 'ticket have already this user')
// server
define('ServerNotExist',       60301, 'server not exist')
define('ServerAlreadyExist',   60302, 'server already exist')
// box
define('BoxNotExist',       60401, 'box not exist')
define('BoxAlreadyExist',   60402, 'box already exist')
define('BoxAlreadyExpired', 60403, 'box already expired')

module.exports = Object.freeze(E)
