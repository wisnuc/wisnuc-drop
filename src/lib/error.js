/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   error.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/05 17:17:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/09 10:44:31 by JianJin Wu       ###   ########.fr       */
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
// websocket

// user: 600XX
define('UserNotExist',     60000, 'user not exist')
define('UserAlreadyExist', 60001, 'user already exist')
// station: 601XX
define('StationNotExist',     60100, 'station not exist')
define('StationAlreadyExist', 60101, 'station already exist')
define('StationNotOnline',    60102, 'station not online')
// ticket: 602XX
define('TicketNotExist',       60200, 'ticket not exist')
define('TicketAlreadyExist',   60201, 'ticket already exist')
define('TicketAlreadyExpired', 60202, 'ticket already expired')
// ticket_user
define('TicketUserNotExist',    60203, 'ticket_user not exist')
define('TicketAlreadyHaveUser', 60204, 'ticket already have user')
// pipe: 603XX
define('PipeResponseTimeout',      60300, 'pipe: response time over 15s')
define('PipeResponseHaveFinished', 60301, 'pipe: client response already finished')
define('PipeTooMuchTask',          60302, 'pipe: too much processing tasks')
// fetch file: 6031X
define('FetchFileQueueNoServer', 60310, 'fetchFile queue have`t server')
// store file: 6032X
define('StoreFileQueueNoServer', 60320, 'storeFile queue have`t server')
define('NoManiFestField',        60321, 'no manifest field')
define('FormError',              60322, 'form error')
// transform json: 6033XX
define('TransformJsonQueueNoServer', 60330, 'transformJson queue have`t server')
// server: 604XX
define('ServerNotExist',     60400, 'server not exist')
define('ServerAlreadyExist', 60401, 'server already exist')
// box: 605XX
define('BoxNotExist',     60500, 'box not exist')
define('BoxAlreadyExist', 60501, 'box already exist')

module.exports = Object.freeze(E)
