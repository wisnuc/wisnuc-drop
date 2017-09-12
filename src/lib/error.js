/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   error.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/05 17:17:42 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/12 17:08:03 by JianJin Wu       ###   ########.fr       */
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

module.exports = Object.freeze(E)
