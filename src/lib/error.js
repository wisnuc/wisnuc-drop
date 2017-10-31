/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   error.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/05 17:17:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/10/31 11:54:39 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// reference to lunix error code

/**
 400
 401
 403 - 其他错误都走这
 404
 500 - 服务器挂了
 */

/**
 EvalError
 创建一个error实例，表示错误的原因：与 eval() 有关。
 InternalError 
 创建一个代表Javascript引擎内部错误的异常抛出的实例。 如: "递归太多".
 RangeError
 创建一个error实例，表示错误的原因：数值变量或参数超出其有效范围。
 ReferenceError
 创建一个error实例，表示错误的原因：无效引用。
 SyntaxError
 创建一个error实例，表示错误的原因：eval()在解析代码的过程中发生的语法错误。
 TypeError
 创建一个error实例，表示错误的原因：变量或参数不属于有效类型。
 URIError
 创建一个error实例，表示错误的原因：给 encodeURI()或  decodeURl()传递的参数无效。
 */
const logger = global.Logger(__filename)
const E = {}

// generate function
const EClass = (message) => {
	return class extends Error {
		constructor(m = message) {
			super(m)
		}
	}
}

// generate new class
const define = (code, message) => E[code] = EClass(message)

define('EUSERNOTEXIST', 'user not exist')
define('ENODENOTFOUND', 'user already exist')
define('ENODENOTFOUND', 'user not in station')
// user already delete
// user already update
// user not in box
// user not in 

// define('ENODENOTFOUND', 'station not exist') 
// define('ENODENOTFOUND', 'station already exist') 

Object.freeze(E)


let Code = {
	200: 'ok',
	400: 'invalid parameters',
	401: 'Authentication failed',
	403: 'forbidden', // 
	404: 'not found', 
	500: 'system error'
}

let Errorcode = {
	
}

class ErrorCode extends Error {
	constructor() {
		
	}

	
}




module.exports = Object.freeze(E)
