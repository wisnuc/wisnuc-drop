/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   dicer.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/21 17:19:12 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/27 14:55:19 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const http = require('http')
const inspect = require('util').inspect
const Dicer = require('dicer')
const debug = require('debug')('dicer')
const sanitize = require('sanitize-filename')
// quick and dirty way to parse multipart boundary
const RE_BOUNDARY = /^multipart\/.+?(?: boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i
const PORT = 8088
const HTML = new Buffer('<html><head></head><body>\
                      <meta http-equiv="content-type" content="text/html; charset=utf-8">\
                       <form method="POST" enctype="multipart/form-data">\
                         <input type="text" name="manifest"><br />\
                         <input type="file" name="filefield" multiple="multiple"><br />\
                         <input type="submit">\
                       </form>\
                       </body></html>')

http.createServer(function (req, res) {
  
  const m = RE_BOUNDARY.exec(req.headers['content-type'])
  
  if (req.method === 'POST' && req.headers['content-type']) {
    
    let dicer = new Dicer({ boundary: m[1] || m[2] })
    
    let count = 0

    const dicerOnPart = part => {
      debug('New part!')

      let x = { number: count++, part }
      // Request header
      part.on('header', function (header) {
        debug('header', header)
        // { 'content-disposition': [ 'form-data; name="manifest"' ] }
        // { 'content-disposition': [ 'form-data; name="filefield"; filename="nodejs-server-server-generated.zip"' ], 'content-type': [ 'application/zip' ] }
      
        let name = parseHeader(header)
        if (name === 'manifest') {
          setTimeout(function(){
            onField(x)
          }, 5000)
        } 
      
      })
      
      const parseHeader = header => {
        
        let name, filename, fromName, toName
        // let x = header['content-disposition'][0].split('; ')
        let x = Buffer.from(header['content-disposition'][0], 'binary').toString('utf8').replace(/%22/g, '"').split('; ')
        //fix %22
      
        if (x[0] !== 'form-data') throw new Error('not form-data')
        if (!x[1].startsWith('name="') || !x[1].endsWith('"')) throw new Error('invalid name') 
        name = x[1].slice(6, -1) 
        debug('x:' + x)
        // validate name and generate part.fromName and .toName
        let split = name.split('|')
        if (split.length === 0 || split.length > 2) throw new Error('invalid name')
        if (!split.every(name => name === sanitize(name))) throw new Error('invalid name')
        fromName = split.shift()
        toName = split.shift() || fromName
        
        debug(`name: ${name}`)
        return name
      }
    }
    
    const onFile = x => {
      x.part.on('data', function (data) {
        // debug('Part data: ' + data)
        debug(`pipe`)
      })

      x.part.on('end', function () {
        debug('End of part\n')
      })

      x.part.on('err', err => {
        debug(`error: ${err}`)
      })
    }
    const onField = x => {
      debug('fieldName')

      onFile(x)
    }
    const onEnd = x => {}
    
    dicer.on('part',  dicerOnPart)
    
    dicer.on('finish', () => {
      dicer = null
      debug('End of parts')
      res.writeHead(200)
      res.end('Form submission successful!')
    })
    dicer.on('error', err => {
      req.unpipe(dicer)
      dicer.end()
      dicer = null
      res.writeHead(500)
      res.end(err.toString())
    })
    
    req.pipe(dicer)
  } 
  else if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200)
    res.end(HTML)
  } 
  else {
    res.writeHead(404)
    res.end()
  }
}).listen(PORT, function () {
  debug('Listening for requests on port ' + PORT)
})
