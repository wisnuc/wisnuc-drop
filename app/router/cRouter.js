/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cRouter.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/24 15:27:02 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * router for client
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app

  const subRouter = router.namespace('/c/v1')
  // token
  subRouter.get('/token', controller.c.token.oauth2)
  subRouter.post('/token', controller.c.token.mpToken)
  // user
  subRouter.post('/users', controller.c.user.create) // FIXME:
  subRouter.get('/users/:id', controller.c.user.show)
  subRouter.get('/users/:id/stations', controller.c.user.findStations)
  subRouter.get('/users/:userId/interestingPerson', controller.c.user.findInteresting)
  subRouter.get('/users/:userId/interesting/personId', controller.c.user.findInterestingSources)
  // ticket
  subRouter.get('/tickets', controller.c.ticket.index)
  subRouter.get('/tickets/:id', controller.c.ticket.show)
  subRouter.post('/tickets/:id/invite', controller.c.ticket.inviteUser)
  subRouter.post('/tickets/:ticketId/boxes/:boxId/share', controller.c.ticket.shareBox)
  subRouter.get('/tickets/:id/users', controller.c.ticket.findAllUser)
  subRouter.post('/tickets/:id/users', controller.c.ticket.createUser)
  subRouter.get('/tickets/:id/users/:userId', controller.c.ticket.findUser)
  // station
  subRouter.get('/stations/:id', controller.c.station.show)
  subRouter.get('/stations/:id/users', controller.c.station.findUsers)
  subRouter.post('/stations/:id/pipe', controller.c.station.storeFile)
  subRouter.get('/stations/:id/pipe', controller.c.station.fetchFile)
  subRouter.get('/stations/:id/json', controller.c.station.getJson)
  subRouter.post('/stations/:id/json', controller.c.station.postJson)
  // box
  subRouter.get('/boxes', controller.c.box.index)
  subRouter.get('/boxes/:boxId', controller.c.box.show)
  subRouter.get('/boxes/:boxId/users', controller.c.box.findUser)
  subRouter.get('/boxes/:boxId/ticket', controller.c.box.findShareTicket)
  subRouter.post('/boxes/:boxId/stations/:stationId/pipe', controller.c.box.storeFile)
  subRouter.get('/boxes/:boxId/stations/:stationId/pipe', controller.c.box.fetchFile)
  subRouter.get('/boxes/:boxId/stations/:stationId/json', controller.c.box.getJson)
  subRouter.post('/boxes/:boxId/stations/:stationId/json', controller.c.box.postJson)
  // tweet
}
