/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   consistentHash.js                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/10/20 11:04:55 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/10/25 10:23:12 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/**
 * 
 */
const crypto = require('crypto')

module.exports = class ConsistentHash {
  
  constructor(nodes, options) {

    this.replicas  = (options && options.replicas) || 160
    this.algorithm = (options && options.algorithm) || 'md5'
    this.ring  = {}
    this.keys  = []
    this.nodes = [] 
    
    if (!Array.isArray(nodes)) throw new Error('nodes must be array')
    for (let node of nodes) {
      this.addNode(node)
    }
  }
  
  addNode(node) {
    this.nodes.push(node)
    // add virtual node
    for (let i = 0; i < this.replicas; i++) {
      let key = this.crypto((node.id || node) + ':' + i)
      this.keys.push(key)
      this.ring[key] = node
    }
    this.keys.sort()
  }
  
  removeNode(node) {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] == node) {
        this.nodes.splice(i, 1)
        i--
      }
    }
    
    for (let i = 0; i < this.replicas; i++) {
      let key = this.crypto((node.id || node) + ':' + i)
      delete this.ring[key]
      // delete virtual node
      for (let j = 0; j < this.keys.length; j++){
        if (this.keys[j] == key) {
          this.keys.splice(j, 1)
          j--
        }
      } 
    }
  }
  
  getNode(key) {
    if (this.getRingLength() == 0) return 0
    
    let hash = this.crypto(key)
    let pos = this.getNodePosition(hash)
    
    return this.ring[this.keys[pos]]
  }

  getNodePosition(hash) {
    let upper = this.getRingLength() - 1
    let lower = 0
    let idx = 0
    let comp = 0
    // 如果只有一个node， return 0
    if (upper == 0) return 0
    
    while (lower <= upper) {
      idx = Math.floor((lower + upper) / 2) // 取整
      comp = this.compare(this.keys[idx], hash)

      if (comp == 0) {
        return idx
      }
      else if (comp > 0) {
        upper = idx - 1
      }
      else {
        lower = idx + 1
      }
    }
    
    if (upper < 0) {
      upper = this.getRingLength() - 1
    }
    return upper    
  }

  getRingLength() {
    return Object.keys(this.ring).length
  }

  compare(v1, v2) {
    return v1 > v2 ? 1 : v1 < v2 ? -1 : 0
  }
  
  crypto(str) {
    return crypto.createHash(this.algorithm).update(str).digest('hex')
  }
  
}