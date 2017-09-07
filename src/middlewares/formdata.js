/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   formdata.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/11 14:36:15 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const formidable = require('formidable')
const UUID = require('uuid')
const map = new Map() // (UUID, req)

const formdata = (req, res, next) => {
	
	// req.formdata = {
	// 	sessionId: UUID.v4()
	// } 
	
	map.set(UUID.v4(), req)
	
	let finished
	let filename, size, sha256, upload
	let form = new formidable.IncomingForm()

	/**
	 * form error
	 * @param {*} err 
	 */
	let error = err => {

		if (finished) return
		finished = true

		if (upload) upload.abort()
		res.status(500).json({
			code: err.code,
			message: err.message
		})
	}

	form.on('field', (key, value) => {

		if (finished) return

		switch (key) {
			case 'size':

				size = parseInt(value)

				if (!Number.isInteger(size) || size < 1 || size > 1024 * 1024 * 1024 * 1024) {
					finished = true
					return res.status(400).json({
						message: 'invalid size'
					})
				}

				break

			case 'sha256':

				sha256 = value

				if (!isSHA256(value)) {
					finished = true
					return res.status(400).json({
						message: 'invalid sha256'
					})
				}

				break

			default:
				console.log('formdata, unexpected key value', key, value)
				break
		}
	})

	form.onPart = function (part) {

		if (finished === true) return

		// let formidable handle all non-file parts
		if (!part.filename) return form.handlePart(part)
		

		let opts = {
			path: req.formdata.path,
			size,
			sha256
		}


		upload = sidekick.upload(opts, (err, status) => {

			if (finished) return
			finished = true

			if (!err && status >= 200 && status < 300) {

				req.formdata.size = size
				req.formdata.sha256 = sha256
				req.formdata.filename = part.filename

				if (offset) req.formdata.offset = offset

				next()
			} else if (!err && status >= 400 && status < 500) {
				res.status(status).end()
			} else {
				res.status(500).end()
			}
		})

		part.on('data', function (data) {

			if (finished) return
			upload.write(data)
		})

		part.on('end', function () {

			if (finished) return
			upload.end()
		})

		part.on('error', error)
	}

	form.on('error', error)
	form.parse(req)
}

module.exports = formdata
