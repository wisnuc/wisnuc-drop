/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   storeFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/30 18:17:09 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:store')
const uuid = require('uuid')
const Dicer = require('dicer')


const mixin = require('../lib/mixin')
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
 * formidable upload file
 * @class StoreFileService
 * @extends Service
 */
class StoreFileService extends threadify(Service) {

  constructor(ctx) {
    super(ctx)
    this.jobId = uuid.v4()
    this.timer = Date.now() + 5 * 1000
    this.ctx.req.on('close', err => {
      debug('request close')
      this.error(err)
    })
    // req error
    this.ctx.req.on('error', err => {
      debug('request error')
      this.error(err)
    })
    this.ctx.req.on('abort', err => {
      debug('request abort')
      this.error(err)
    })
    // join concurrency queue
    ctx.service.queue.set(this)
  }

  createServer() {
    return this
  }
  // dicer
  async run() {
    let stationId = this.ctx.params.id || this.ctx.params.stationId
    let user = this.ctx.auth.user

    const m = RE_BOUNDARY.exec(this.ctx.request.header['content-type'])
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
          } else {
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
        this.ctx.req.unpipe(dicer)
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
      this.ctx.req.unpipe(dicer)
      dicer.end()
      dicer = null
      this.res.error(err)
    })
    // pipe dicer
    this.ctx.req.pipe(dicer)
  }
	/**
	 * find matched station, and send message
	 * @param {string} stationId
	 * @param {object} manifest - queryString
	 * @memberof Server
	 */
  async notice(stationId, manifest) {
    debug(`manifest pipe successfully`, this.app)
    await mqttService.pipe(stationId, manifest)
  }

	/**
	 * station reponse this request
	 * @param {Object} resCtx - response ctx
	 * @memberof Server
	 */
  response(resCtx) {
    this.resCtx = resCtx
    debug(`this ws start`)
    if (this.isTimeOut()) this.error('response storeFile timeout')
    // this.ws 是个转折点
    this.ws = writeStream
  }
  // step 3: report result to client
  reportResult(repCtx) {
    const { error, data } = repCtx.body
    // if error exist, server.error()
    if (error) {
      const { message, code } = error
      this.error(message, code)
    } else {
      this.success(data)
    }
    repCtx.res.end()
  }

  isTimeOut() {
    return !!Date.now() > this.timer
  }

  finished() {
    return this.ctx.res.finished
  }

  success(data) {
    if (this.finished()) return
    this.ctx.success(data)
    this.resCtx.res.end()
    this.close()
  }

  error(err, code) {
    if (this.finished()) return
    this.ctx.error(err, code)
    this.resCtx.res.end()
    this.close()
  }

  abort() {
    this.finished() = true
  }
  // delete this server
  close() {
    this.ctx.service.queue.close(this.jobId)
  }
}

module.exports = StoreFileService
