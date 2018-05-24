/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/16 10:25:30 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/24 17:21:05 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const AppSchema = new Schema({
    _id: String,
    type: { type: String, required: true },
    version: { type: String, required: true },
    index: { type: Number, required: true },
  }, {
    timestamps: true,
  })

  AppSchema.index({ version: 1 })
  AppSchema.index({ index: 1 })

  return mongoose.model('App', AppSchema)
}
