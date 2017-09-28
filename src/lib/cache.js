
/**
 * cache data by redis
 * @module cache
 */

const Redis = require('ioredis')
const redis = new Redis()

redis.set('foo', 'bar')
