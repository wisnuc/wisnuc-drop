/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   transformJson.js                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/27 17:38:50 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/28 14:38:18 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const autocannon = require('autocannon')

const cToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiYjI1MjQ4NjktY2MyNS00YzA4LWI0ODAtYThhYjgwODBjNGIyIiwibmlja05hbWUiOiJBbmR5IiwiYXZhdGFyVXJsIjoiaHR0cDovL3d4LnFsb2dvLmNuL21tb3Blbi92aV8zMi90NFlSTTZSYkM2ZWpXNFFTNWdsOTRPT2FEaWJMWXppYTJuT08yR3ZrdWxBanp1REFvT1dwYXhueW43emZ6WGlheTA3VExpYlNXbzBYWFB2V0owdFRScHhxR2cvMCJ9LCJleHAiOjE1MDkxNjA2MzEzMTV9.YESJQ0XK97Hi82u8RBGOapgKcAO8Wcp_97p--07y0sI'

const userId = 'b2524869-cc25-4c08-b480-a8ab8080c4b2'
const stationId = '9bfad174-151e-4e59-bb26-6e80e7790b24'
// const BASE_URL = 'http://www.siyouqun.org'
const BASE_URL = 'http://localhost:4000'
const URL = BASE_URL + `/c/v1/stations/${stationId}/json?resource=L21lZGlh&method=GET`

autocannon({
	url: URL,
	headers: {
		authorization: cToken
	},
  connections: 100, // default 0.1k
  pipelining: 1, 	 	// default
  duration: 10000   // default 10k
}, console.log)
