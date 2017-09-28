/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   box.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>           +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/22 10:38:45 by JianJin Wu          #+#    #+#             */
/*   Updated: 2017/08/22 10:43:24 by JianJin Wu         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const mongoose = require('mongoose')
const BoxSchema = mongoose.Schema({
	name: String,
	title: {type: String, required: true}
})


module.exports = mongoose.model('box', BoxSchema)
