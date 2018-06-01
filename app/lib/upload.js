/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   upload.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/06/01 18:08:26 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/01 18:21:20 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Dicer = require('dicer')
const debug = require('debug')('app:lib:dicer')

const RE_BOUNDARY = /^multipart\/.+?(?: boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i

class Upload {

  constructor(ctx) {
    this.ctx = ctx
  }

  async run() {
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
          let name = this.parseHeader(header)
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
  }
  errorHandler() {
    debug('dicer errror')
    if (dicer) {
      dicer.removeAllListeners()
      dicer.on('error', () => {})
      this.ctx.req.unpipe(dicer)
      dicer.end()
      dicer = null
    }
  }
  parseHeader(header) {
    const x = Buffer.from(header['content-disposition'][0], 'binary').toString('utf8').replace(/%22/g, '"').split('; ')
    // fixed %22
    if (x[0] !== 'form-data') throw new Error('not form-data')
    if (!x[1].startsWith('name="') || !x[1].endsWith('"')) throw new Error('invalid name')
    const name = x[1].slice(6, -1)
    return name
  }
}

module.exports = Upload
