/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/05/15 14:35:39 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/09 17:02:01 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// require('./wafer/globals')
// require('./wafer/setup-qcloud-sdk')
require('./utils/global')

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const log4js = require('log4js')

// const session = require('express-session')
// const session = require('wafer-node-session')
// const RedisStore = require('connect-redis')(session)

const routes = require('./routes/index')
const Logger = require('./utils/logger').Logger('app')

const app = express()

// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
// 	secret: 'wisnuc-drop',
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { secure: true }
// }))
// app.use(session({
// 	// 小程序 appId
// 	appId: '',

// 	// 小程序 appSecret
// 	appSecret: '',

// 	// 登录地址
// 	loginPath: '/login',

// 	// 会话存储
// 	store: new RedisStore({

// 	})
// }))

app.use(log4js.connectLogger(Logger, {
	level: 'INFO',
	format: ':remote-addr  :method  :url  :status  :response-time' + 'ms'
}))
app.use(bodyParser.json({ limit: '10000kb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// res middleware
app.use(require('./middlewares/res'))

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found')
	err.status = 404
	res.status(err.status).json(err.message)
	next()
})

module.exports = app
