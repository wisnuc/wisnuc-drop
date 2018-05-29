/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   storeFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 17:52:24 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:store')
const uuid = require('uuid')
const Dicer = require('dicer')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')

const RE_BOUNDARY = /^multipart\/.+?(?: boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i

/**
 * store file
	notication:
	1. filed 处理
	2. 并发请求
	3. buffer []
*/

/**
 * pload file
 * @class Server
 * @extends {EventEmitter}
 */
class Server extends threadify(EventEmitter) {

  constructor(req, res) {
    super()
    this.req = req
    this.res = res
    this.jobId = uuid.v4()
    this.timer = Date.now() + 15 * 1000
    this.req.on('close', err => {
      debug('request close')
      this.error(err)
    })
    // req error
    this.req.on('error', err => {
      debug('request error')
      this.error(err)
    })
    this.req.on('abort', err => {
      debug('request abort')
      this.error(err)
    })
  }

  // dicer
  async run() {
    let stationId = this.req.params.id || this.req.params.stationId
    let user = this.req.auth.user

    const m = RE_BOUNDARY.exec(this.req.headers['content-type'])
    let dicer = new Dicer({ boundary: m[1] || m[2] })

    let filePart
    // until ws come in, emit different action
    this.defineSetOnce('ws', () => {
      debug('ws defineSetOnce')
      return filePart && onFile(filePart)
    })
    // two part
    const dicerOnPart = part => {
      debug('New Part')
      // hanlder error
      part.on('error', err => {
        debug(`part err${err}`)
        part.removeAllListeners()
        part.on('error', () => {})
        errorHandler()
      })
      // Request header
      part.on('header', function (header) {
        // { 'content-disposition': [ 'form-data; name="manifest"' ] }
        // { 'content-disposition': [ 'form-data; name="file"; filename="nodejs-server-server-generated.zip"' ], 'content-type': [ 'application/zip' ] }
        // let x = header['content-disposition'][0].split('; ')
        try {
          let name = parseHeader(header)
          if (name === 'manifest') {
            onField(part)
          }
          else {
            filePart = part
          }
        }
        catch(err) {
          return this.error(err)
        }

      })
    }
    const errorHandler = () => {
      debug('dicer errror')
      if(dicer) {
        dicer.removeAllListeners()
        dicer.on('error', () => {})
        this.req.unpipe(dicer)
        dicer.end()
        dicer = null
      }
    }
    const parseHeader = header => {
      let x = Buffer.from(header['content-disposition'][0], 'binary').toString('utf8').replace(/%22/g, '"').split('; ')
      //fix %22
      if (x[0] !== 'form-data') throw new Error('not form-data')
      if (!x[1].startsWith('name="') || !x[1].endsWith('"')) throw new Error('invalid name')
      let name = x[1].slice(6, -1)
      return name
    }
    // file pipe
    const onFile = part => part.pipe(this.ws)
    // field
    const onField = part => {
      // multiple events could be triggered
      let dataBuffers = []
      part.on('data', data => dataBuffers.push(data))
      part.on('end', async () => {
        debug('End of part')
        try {
          debug('field data start')
          let body = JSON.parse(Buffer.concat(dataBuffers))
          let method, resource
          method = body.method
          resource = body.resource
          delete body.method
          delete body.resource
          let manifest = Object.assign({},
            {
              method: method,
              resource: resource,
              body: body,
              sessionId: this.jobId,
              user: {
                id: user.id,
                nickName: user.nickName,
                unionId: user.unionId
              }
            }
          )
          // notice station to response
          await this.notice(stationId, manifest)
        }
        catch (err) {
          this.error(err)
        }
      })
      part.on('err', err => debug(`error: ${err}`))
    }
    // dicer part
    dicer.on('part', dicerOnPart)
    dicer.on('finish', () => {
      dicer = null
      if (this.ws) this.ws.end()
      debug('End of parts')
    })
    dicer.on('error', err => {
      this.req.unpipe(dicer)
      dicer.end()
      dicer = null
      this.res.error(err)
    })
    // pipe dicer
    this.req.pipe(dicer)
  }
	/**
	 * find matched station, and send message
	 * @param {string} stationId
	 * @param {object} manifest - queryString
	 * @memberof Server
	 */
  async notice(stationId, manifest) {
    debug(`manifest pipe successfully`)
    await mqttService.pipe(stationId, manifest)
  }

	/**
	 * station repay
	 * @param {any} writeStream
	 * @memberof Server
	 */
  repay(writeStream) {
    debug(`this ws start`)
    // this.ws 是个转折点
    this.ws = writeStream
  }

  isTimeOut() {
    if (Date.now() > this.timer) {
      let e = new E.PipeResponseTimeout()
      this.error(e)
      return true
    }
    return false
  }

  finished() {
    return this.res.finished
  }

  success(data) {
    if (this.finished()) return
    this.res.success(data)
  }

  error(err, code) {
    if (this.finished()) return
    this.res.error(err, code)
  }

  abort() {
    this.res.finished = true
  }
}


/**
 * formidable upload file
 * @class StoreFileService
 * @extends Service
 */
class StoreFileService extends Service {

  constructor() {
    this.limit = 1024
    this.map = new Map()
    // global handle map
    setInterval(() => {
      if (this.map.size === 0) return
      this.schedule()
    }, 30000)
  }

  // schedule
  schedule() {
    this.map.forEach((v, k) => {
      if (v.finished()) this.map.delete(k)
    })
  }

  request(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.StoreFileQueueNoServer(), 403, false)
    // timeout
    if (server.isTimeOut()) {
      let e = new E.PipeResponseTimeout()
      // end
      this.close(jobId)
      return res.error(e)
    }
    if (server.finished()) {
      let e = new E.PipeResponseHaveFinished()
      this.close(jobId)
      return res.error(e)
    }
    // repay
    server.repay(res)
    // req error
    req.on('error', err => {
      // response
      res.error(err)
      server.error(err)
    })
  }

  createServer(req, res) {
    this.schedule()
    debug('store size: ', this.map.size)
    if (this.map.size > this.limit)
      throw new E.PipeTooMuchTask()
    let server = new Server(req, res)
    this.map.set(server.jobId, server)
    return server
  }
	/**
	 * response store error to client
	 * @param {any} req
	 * @param {any} res
	 * @memberof StoreFileService
	 */
  response(req, res) {
    let jobId = req.params.jobId
    let server = this.map.get(jobId)
    if (!server) return res.error(new E.StoreFileQueueNoServer(), 403, false)
    // finished
    if (server.finished()) return res.end()

    let { error, data } = req.body
    // if error exist, server.error()
    if (error) {
      let { message, code } = error
      server.error(message, code)
    }
    else {
      server.success(data)
    }
    res.success()
    // end
    this.close(jobId)
  }
	/**
	 * close life cycle of the instance
	 * @param {any} jobId
	 * @param {any} err
	 * @memberof StoreFileService
	 */
  close(jobId) {
    let server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = StoreFileService
