/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sRtouer.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/29 14:08:03 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * router for station
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, middleware, controller } = app

  const subRouter = router.namespace('/s/v1')
  const { authStation } = middleware
  const { user, ticket, station, box, tweet } = controller.s
  // // user
  subRouter.get('/users/:id', authStation(), user.index)
  // ticket
  subRouter.post('/tickets', authStation(), ticket.create)
  subRouter.get('/tickets', authStation(), ticket.index)
  subRouter.get('/tickets/:id', authStation(), ticket.show)
  subRouter.patch('/tickets/:id', authStation(), ticket.update)
  subRouter.get('/tickets/:id/users', authStation(), ticket.findAllUser)
  subRouter.patch('/tickets/:id/users', authStation(), ticket.updateUserStatus)
  subRouter.get('/tickets/:id/users/:userId', authStation(), ticket.findUser)
  subRouter.patch('/tickets/:id/users/:userId', authStation(), ticket.updateUser)
  // station
  subRouter.post('/stations/', authStation(), station.create)
  subRouter.get('/stations/:id', authStation(), station.index)
  subRouter.patch('/stations/:id', authStation(), station.update)
  subRouter.delete('/stations/:id', authStation(), station.destory)
  subRouter.get('/stations/:id/token', authStation(), station.getToken)
  subRouter.get('/stations/:id/users', authStation(), station.findUsers)
  subRouter.post('/stations/:id/response/:jobId', authStation(), station.storeFile)
  subRouter.get('/stations/:id/response/:jobId/pipe/store', authStation(), station.fetchFile)
  subRouter.post('/stations/:id/response/:jobId', authStation(), station.getJson)
  subRouter.post('/stations/:id/response/:jobId/pipe/fetch', authStation(), station.postJson)
  subRouter.post('/stations/:id/response/:jobId/json', authStation(), station.postJson)
  // box
  subRouter.post('/boxes', authStation(), box.create)
  subRouter.post('/boxes/batch', authStation(), box.bulkCreate)
  subRouter.patch('/boxes/:boxId', authStation(), box.update)
  subRouter.delete('/boxes/:boxId', authStation(), box.destory)
  // tweet
  subRouter.post('/tweets', authStation(), tweet.create)
}
