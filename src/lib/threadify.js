/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   threadify.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/08/01 15:15:06 by JianJin Wu        #+#    #+#             */
/*   Updated: 2018/02/06 15:44:21 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Promise = require('bluebird')
const stream = require('stream')
const debug = require('debug')('app:threadify')

const EABORT = Object.assign(new Error('aborted'), { code: 'EABORT' })

/**
 * observable class
 * @class Threadify
 */
module.exports = base => class extends base {

  constructor(...args) {
    super(...args)
    this.EABORT = EABORT
    this._thrListeners = []
  }

	/**
	 * define an observable property with given name, value, and optional options.
	 * @param {any} name 
	 * @param {any} value 
	 * @param {any} action 
	 */
  define(name, value, action) {
    let _name = '_' + name
    this[_name] = value
    Object.defineProperty(this, name, {
      get: function () {
        return this[_name]
      },
      set: function (x) {
        this[_name] = x
        if (action) action()
      }
    })
  }

	/**
	 * efine an observable property that can only be set once with a truthy value. The property is initialized to undefined.
	 * @param {any} name 
	 * @param {any} action 
	 */
  defineSetOnce(name, action) {
    let _name = '_' + name
    this[_name] = undefined
    Object.defineProperty(this, name, {
      get: function () {
        return this[_name]
      },
      set: function (x) {
        if (this[_name]) return
        this[_name] = x
        if (action) action()
      }
    })
  }

  /**
	 * The given predicate is evaluated each time an observable is updated. The promise is resolved when the predicate evaluates to a truthy value, or is rejected when this.error is set.
	 * @param {function} predicate - a function evaluates to truthy or falsy value
	 * @returns {promise}
	 */
  async until(predicate) {
    if (this.error) throw this.error
    if (predicate()) return
    return new Promise((resolve, reject) =>
      this._thrListeners.push({ predicate, resolve, reject }))
  }
}
