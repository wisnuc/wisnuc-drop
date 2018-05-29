/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ticket.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/23 17:49:37 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 14:10:17 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { Controller } = require('egg')
const Joi = require('joi')

class TicketController extends Controller {
  async index() {}
  async show() {}
  async inviteUser() {}
  async shareBox() {}
  async findAllUser() {}
  async createUser() {}
  async findUser() {}
}

module.exports = TicketController
