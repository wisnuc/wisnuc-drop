/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   storeFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/01 18:07:28 by Jianjin Wu       ###   ########.fr       */
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
class Server extends threadify(EventEmitter) {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
    this.jobId = '123456' // uuid.v4()
    this.timer = 5 * 1000
    this.ctx.req.on('close', () => {
      debug('request close')
      const err = new Error('storefile request close')
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
  }

  // dicer
  run() {
    return new Promise((resolve, reject) => {
      const stationId = this.ctx.params.id || this.ctx.params.stationId
      const user = this.ctx.auth.user

      const m = RE_BOUNDARY.exec(this.ctx.request.header['content-type'])
      let dicer = new Dicer({ boundary: m[1] || m[2] })

      const errorHandler = () => {
        debug('dicer errror')
        if (dicer) {
          dicer.removeAllListeners()
          dicer.on('error', () => {})
          this.ctx.req.unpipe(dicer)
          dicer.end()
          dicer = null
        }
      }

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
          } catch (err) {
            return this.error(err)
          }
        })
      }

      const parseHeader = header => {
        const x = Buffer.from(header['content-disposition'][0], 'binary').toString('utf8').replace(/%22/g, '"').split('; ')
        // fixed %22
        if (x[0] !== 'form-data') throw new Error('not form-data')
        if (!x[1].startsWith('name="') || !x[1].endsWith('"')) throw new Error('invalid name')
        const name = x[1].slice(6, -1)
        return name
      }
      // file pipe
      const onFile = part => part.pipe(this.ws)
      // field
      const onField = part => {
        // multiple events could be triggered
        const dataBuffers = []
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
            let manifest = Object.assign({}, {
              method: method,
              resource: resource,
              body: body,
              sessionId: this.jobId,
              user: {
                id: user.id,
                nickName: user.nickName,
                unionId: user.unionId
              }
            })
            debug(`manifest pipe successfully`)
            // notice station to response
            await this.ctx.service.mqtt.pipe(stationId, manifest)
            resolve()
          }
          catch (err) {
            // this.error(err)
            reject(err)
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
        // this.res.error(err)
        reject(err)
      })
      // pipe dicer
      this.ctx.req.pipe(dicer)
    })
  }
  /**
	 * notice station
   * @param {String} stationId - station uuid
	 * @param {Object} manifest
	 * @memberof Server
	 */
  notice(stationId, manifest) {
    this.ctx.mqtt.pipe(stationId, manifest)
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
    this.ws = resCtx.res
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
    // if (this.finished()) return
    this.ctx.success(data)
    this.resCtx.res.end()
    this.close()
  }

  error(err, code) {
    // if (this.finished()) return
    this.ctx.error(err, code)
    // this.resCtx.res.end()
    this.close()
  }

  abort() {
    this.ctx.res.finished = true
  }
  // delete this server
  close() {
    this.ctx.service.queue.close(this.jobId)
  }
}
/**
 * upload file.
 * @class StoreFileService
 * @extends Service
 */
class StoreFileService extends Service {

  createServer(ctx) {
    const server = new Server(ctx)
    this.service.queue.set(server.jobId, server)
    return server
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

  request(ctx) {
    const jobId = ctx.params.jobId
    const server = this.map.get(jobId)
    if (!server) return ctx.error(new E.StoreFileQueueNoServer(), 403, false)
    // timeout
    if (server.isTimeOut()) {
      const e = new E.PipeResponseTimeout()
      // end
      this.close(jobId)
      return ctx.error(e)
    }
    if (server.finished()) {
      const e = new E.PipeResponseHaveFinished()
      this.close(jobId)
      return ctx.error(e)
    }
    // repay
    server.repay(ctx)
    // req error
    ctx.on('error', err => {
      // response
      ctx.error(err)
      server.error(err)
    })
  }
	/**
	 * response store error to client
	 * @param {Object} repCtx
	 * @memberof StoreFile
	 */
  response(repCtx) {
    const jobId = repCtx.params.jobId
    const server = this.map.get(jobId)
    if (!server) return repCtx.error(new E.StoreFileQueueNoServer(), 403, false)
    // finished
    if (server.finished()) return repCtx.end()
    const { error, data } = repCtx.body
    // if error exist, server.error()
    if (error) {
      const { message, code } = error
      server.error(message, code)
    } else {
      server.success(data)
    }
    repCtx.success()
  }
  /**
	 * close life cycle of the instance
	 * @param {String} jobId - job uuid
	 * @param {Object} err
	 * @memberof StoreFile
	 */
  close(jobId) {
    const server = this.map.get(jobId)
    if (!server) return
    // delete map
    this.map.delete(jobId)
  }
}

module.exports = StoreFileService
