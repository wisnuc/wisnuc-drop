const { BlackList } = require('../schema')
const crypto = require('crypto')

class BlackListService {
  constructor() {

  }

  insert(boxid, options) {
    return BlackList.updateOne({ boxid }, { boxid, data: options.data }, { upsert: true })
  }

  find(boxid) {
    let condition = { boxid }
    return new Promise((resolve, reject) => {
      BlackList.find(condition).exec((err, result) => {
        if (err) reject(err)
        else {
          let data = result[0].data
          let dataStr = data.toString()
          let hash = crypto.createHash('sha256')
          hash.update(dataStr)
          let digest = hash.digest('hex')
          resolve({ digest, data })

        }
      })
    })

  }
}

module.exports = new BlackListService()
