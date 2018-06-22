/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cRouter.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/06/22 14:03:17 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * router for client
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, middleware, controller } = app

  const subRouter = router.namespace('/c/v1')
  const { authUser } = middleware
  const { token, user, ticket, station, box } = controller.c
  // token
  subRouter.get('/token', token.oauth2)
  subRouter.post('/token', token.mpToken)
  // user
  subRouter.get('/users/:id', authUser(), user.show)
  subRouter.get('/users/:id/stations', authUser(), user.findStations)
  subRouter.get('/users/:userId/interestingPerson', authUser(), user.findInteresting)
  subRouter.get('/users/:userId/interestingPerson/:personId', authUser(), user.findInterestingSources)
  // ticket
  subRouter.get('/tickets', authUser(), ticket.index)
  subRouter.get('/tickets/:id', authUser(), ticket.show)
  subRouter.post('/tickets/:id/invite', authUser(), ticket.inviteUser)
  subRouter.post('/tickets/:ticketId/boxes/:boxId/share', authUser(), ticket.shareBox)
  subRouter.get('/tickets/:id/users', authUser(), ticket.findAllUser)
  subRouter.post('/tickets/:id/users', authUser(), ticket.createUser)
  subRouter.get('/tickets/:id/users/:userId', authUser(), ticket.findUser)
  // station
  subRouter.get('/stations/:id', authUser(), station.show)
  subRouter.get('/stations/:id/users', authUser(), station.findUsers)
  subRouter.post('/stations/:id/pipe', authUser(), station.storeFile)
  subRouter.get('/stations/:id/pipe', authUser(), station.fetchFile)
  subRouter.get('/stations/:id/json', authUser(), station.getJson)
  subRouter.post('/stations/:id/json', authUser(), station.postJson)
  // box
  subRouter.get('/boxes', authUser(), box.index)
  subRouter.get('/boxes/:boxId', authUser(), box.show)
  subRouter.get('/boxes/:boxId/users', authUser(), box.findUser)
  subRouter.get('/boxes/:boxId/ticket', authUser(), box.findShareTicket)
  subRouter.post('/boxes/:boxId/stations/:stationId/pipe', authUser(), box.storeFile)
  subRouter.get('/boxes/:boxId/stations/:stationId/pipe', authUser(), box.fetchFile)
  subRouter.get('/boxes/:boxId/stations/:stationId/json', authUser(), box.getJson)
  subRouter.post('/boxes/:boxId/stations/:stationId/json', authUser(), box.postJson)
}
