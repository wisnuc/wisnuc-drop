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

require('./utils/global')
require('../src/utils/init').register() 

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const log4js = require('log4js')
const Session = require('express-session')
const FileStore = require('session-file-store')(Session)

const routes = require('./routes/index')
const logger = global.Logger('app')

const app = express()

const session = Session({
	store: new FileStore({ path: './sessions' }),
	secret: 'wisnuc-drop',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
})

// Use express-session middleware for express
app.use(session)

// app.set('trust proxy', 1) // trust first proxy

app.use(log4js.connectLogger(logger, {
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
