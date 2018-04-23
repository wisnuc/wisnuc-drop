/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sRtouer.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/23 17:41:56 by Jianjin Wu       ###   ########.fr       */
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
  // box
  // station
  // tweet
}
