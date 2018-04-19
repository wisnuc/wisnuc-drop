/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cRouter.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/19 11:15:38 by Jianjin Wu       ###   ########.fr       */
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
  // // user
  subRouter.get('/user/:id', controller.user.index)
  // ticket
  // box
  // station
  // tweet
}
