/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sRtouer.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/23 17:21:47 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * router for station
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  const subRouter = router.namespace('/s/v1')
  // // user
  subRouter.get('/users/:id', controller.s.user.index)
  // ticket
  subRouter.post('/tickets', controller.s.ticket.create)
  subRouter.get('/tickets', controller.s.ticket.index)
  subRouter.get('/tickets/:id', controller.s.ticket.show)
  subRouter.patch('/tickets/:id', controller.s.ticket.update)
  subRouter.get('/tickets/:id/users', controller.s.ticket.findAllUser)
  subRouter.patch('/tickets/:id/users', controller.s.ticket.updateUserStatus)
  subRouter.get('/tickets/:id/users/:userId', controller.s.ticket.findUser)
  subRouter.patch('/tickets/:id/users/:userId', controller.s.ticket.updateUser)
  // station
  subRouter.post('/stations/', controller.s.station.create)
  subRouter.get('/stations/:id', controller.s.station.index)
  subRouter.patch('/stations/:id', controller.s.station.update)
  subRouter.delete('/stations/:id', controller.s.station.destory)
  subRouter.get('/stations/:id/token', controller.s.station.getToken)
  subRouter.get('/stations/:id/users', controller.s.station.findUsers)
  subRouter.post('/stations/:id/response/:jobId', controller.s.station.storeFile)
  subRouter.get('/stations/:id/response/:jobId/pipe/store', controller.s.station.fetchFile)
  subRouter.post('/stations/:id/response/:jobId', controller.s.station.getJson)
  subRouter.post('/stations/:id/response/:jobId/pipe/fetch', controller.s.station.postJson)
  subRouter.post('/stations/:id/response/:jobId/json', controller.s.station.postJson)
  // box
  subRouter.post('/boxes', controller.s.box.create)
  subRouter.post('/boxes/batch', controller.s.box.bulkCreate)
  subRouter.patch('/boxes/:boxId', controller.s.box.update)
  subRouter.delete('/boxes/:boxId', controller.s.box.destory)
  // tweet
  subRouter.post('/tweets', controller.s.tweet.create)
}
