/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   storeFile.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 15:41:42 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/29 14:09:30 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Service = require('egg').Service
const debug = require('debug')('app:store')
const uuid = require('uuid')
const Dicer = require('dicer')
const EventEmitter = require('events').EventEmitter

const threadify = require('../lib/threadify')

const RE_BOUNDARY = /^multipart\/.+?(?: boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i

// store file
class Server extends threadify(EventEmitter) {
  constructor(ctx) {
    super(ctx)
    this.ctx = ctx
    this.jobId = '123456' // FIXME: uuid.v4()
    this.timer = 5 * 1000
    this.state = 'pending' // pending, working, fnished
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
  async run() {
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
            const body = JSON.parse(Buffer.concat(dataBuffers))
            const method = body.method
            const resource = body.resource
            delete body.method
            delete body.resource
            const manifest = Object.assign({}, {
              method,
              resource,
              body,
              sessionId: this.jobId,
              user: {
                id: user.id,
                nickName: user.nickName,
                unionId: user.unionId,
              },
            })
            debug('manifest pipe successfully')
            // notice station to response
            await this.ctx.service.mqtt.pipe(stationId, manifest)
          } catch (err) {
            // this.error(err)
            reject(err)
          }
        })
        part.on('err', err => debug(`error: ${err}`))
      }
      let filePart
      // until ws come in, emit different action
      this.defineSetOnce('ws', () => {
        debug('ws defineSetOnce')
        return filePart && onFile(filePart)
      })
      const parseHeader = header => {
        const x = Buffer.from(header['content-disposition'][0], 'binary').toString('utf8').replace(/%22/g, '"').split('; ')
        // fixed %22
        if (x[0] !== 'form-data') throw new Error('not form-data')
        if (!x[1].startsWith('name="') || !x[1].endsWith('"')) throw new Error('invalid name')
        const name = x[1].slice(6, -1)
        return name
      }
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
        part.on('header', header => {
          // { 'content-disposition': [ 'form-data; name="manifest"' ] }
          // { 'content-disposition': [ 'form-data; name="file"; filename="nodejs-server-server-generated.zip"' ], 'content-type': [ 'application/zip' ] }
          // let x = header['content-disposition'][0].split('; ')
          try {
            const name = parseHeader(header)
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
      // dicer part
      dicer.on('part', dicerOnPart)
      dicer.on('finish', () => {
        dicer = null
        if (this.ws) this.ws.end()
        debug('End of parts')
        // resolve('asdasdasd')
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
      console.log(1231333323)
    })
  }
  // notice station
  notice(stationId, manifest) {
    this.ctx.mqtt.pipe(stationId, manifest)
  }
  // station reponse this request
  repay(resCtx) {
    this.resCtx = resCtx
    debug('this ws start')
    if (this.isTimeOut()) this.error('response storeFile timeout')
    // this.ws 是个转折点
    this.ws = resCtx.res
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
  // create store file server
  createServer(ctx) {
    const server = new Server(ctx)
    this.service.queue.set(server.jobId, server)
    return server
  }
  // step 2: request to client
  request(ctx) {
    return new Promise((resolve, reject) => {
      const jobId = ctx.params.jobId
      const server = this.service.queue.get(jobId)
      if (!server) return reject(new E.StoreFileQueueNoServer())
      // timeout
      if (server.isTimeOut()) {
        const e = new E.PipeResponseTimeout()
        // end
        this.close(jobId)
        return reject(e)
      }
      if (server.finished()) {
        const e = new E.PipeResponseHaveFinished()
        this.close(jobId)
        return reject(e)
      }
      // repay
      server.repay(ctx)
      console.log('request start')
      // req error
      ctx.req.on('error', err => {
        // response
        server.error(err)
      })

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
    })
  }
  // step 3: report result to client
  reportResult(repCtx) {
    return new Promise((resolve, reject) => {
      const jobId = repCtx.params.jobId
      const server = this.service.queue.get(jobId)
      if (!server) return reject(new E.StoreFileQueueNoServer())
      // finished
      if (server.finished()) return repCtx.end()
      console.log(123123, repCtx.request.body)
      const { error, data } = repCtx.request.body
      // if error exist, server.error()
      if (error) {
        const { message, code } = error
        server.error(message, code)
      }
      console.log('asdasd123123')
      // return resolve()
      // if (!server) return repCtx.error(new E.StoreFileQueueNoServer(), 403, false)
      // // finished
      // if (server.finished()) return repCtx.end()
      // const { error, data } = repCtx.body
      // // if error exist, server.error()
      // if (error) {
      //   const { message, code } = error
      //   server.error(message, code)
      // } else {
      //   server.success(data)
      // }
      // repCtx.success()
    })
  }
}

module.exports = StoreFileService
