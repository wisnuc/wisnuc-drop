/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   guid.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/03 17:33:23 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/08/31 11:03:16 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function newGuid() {
	var guid = ''
	for (var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16)
		guid += n
		if (i == 8 || i == 12 || i == 16 || i == 20) guid += '-'
	}
	return guid
}

module.exports = newGuid

// const Joi = require('joi')

// const schema = Joi.object().keys({
// 	id: Joi.string().guid().required()
// })

// Joi.validate(
// 	{
// 		id: newGuid()
// 	},
//   schema,
// 	{
// 		abortEarly: false
// 	},
//   function(err, value) {
// 		console.log(111, err)
// 	}
// ) 
