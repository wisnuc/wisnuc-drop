/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mixin.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2018/05/30 16:17:43 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/05/30 16:58:27 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

class Mixin {
  constructor() {}

  mix(...mixins) {
    class Mix {}
    for (let mixin of mixins) {
      this.copyProperties(Mix, mixin) // 拷贝实例属性
      this.copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
    }
    return Mix
  }

  copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
      if ( key !== "constructor"
        && key !== "prototype"
        && key !== "name"
      ) {
        let desc = Object.getOwnPropertyDescriptor(source, key)
        Object.defineProperty(target, key, desc)
      }
    }
  }
}

module.exports = new Mixin()
