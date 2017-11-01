/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   consistentHashing.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/11/01 17:13:59 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/11/01 18:22:38 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * consistent hashing
 * 1. length = 1024
 * 2. 
 */
const crypto = require('crypto')

module.exports = class ConsistentHash {
  
  constructor(nodes, options) {

    this.nodes = [] 
    this.keys  = []
    this.ring  = new Map()
    this.length    = (options && options.length) || 1024
    this.replicas  = (options && options.replicas) || 1
    this.algorithm = (options && options.algorithm) || 'md5'
    
    if (!Array.isArray(nodes)) throw new Error('nodes must be array')
    
    // 遍历 nodes
    for (let node of nodes) {
      this.addNode(node)
    }
  }
  
  // 排序
  _sort() {
    this.keys.sort((a, b) => a > b)
  }
  
  addNode(node) {
    this.nodes.push(node)
    
    for (let i = 0; i < this.replicas; i++) {
      let key = this.crypto((node.id || node) + ':' + i)
      this.keys.push(key)
      this.ring.set(key, node)
    }
    this._sort()
  }
  
  removeNode(node) {
 
  }
  
  getNode(key) {

    let keyLength = this.keys.length
    if (keyLength == 0) return 0
    
    let hash = this.crypto(key)
    
    let arr = []
    for (let i= 0; i< keyLength; i++) {
      
      if (this.keys[i] >= hash) {
        arr.push(this.ring.get(this.keys[i]))
        // 如果
        if (i < keyLength -1) {
          arr.push(this.ring.get(this.keys[i+1]))
        }
        else {
          arr.push(this.ring.get(this.keys[0]))
        }
        break
      }
    }
    return arr
  }
  
  crypto(str) {
    let hash = crypto.createHash(this.algorithm).update(new Buffer(str))
    return Math.abs(hash.digest().readInt32LE()%this.length)
    // return crypto.createHash(this.algorithm).update(str).digest('hex')
  }
  
}