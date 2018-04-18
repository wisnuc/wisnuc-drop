/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/04/17 18:06:08 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/04/17 18:06:11 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  // // user
  router.get('/user', controller.user.index)
  // ticket
  // box
  // station
  // tweet
}
