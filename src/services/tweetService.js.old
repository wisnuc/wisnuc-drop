const { TweetModelCreater } = require('../schema')

class TweetServices {
  constructor() {
    this.modelList = {}
  }

  getModel(boxid) {
    if (!this.modelList[boxid]) this.modelList[boxid] = TweetModelCreater(boxid)
    return this.modelList[boxid]
  }

  insert(boxid, options) {

    let Tweet = this.getModel(boxid)
    let tweetList = options.data.map(item => Object.assign({}, item, { deleted: false }))
    return Tweet.insertMany(tweetList)
    // let tweet = new Tweet(options)
    // return tweet.save()
  }

  find(boxid, query) {
    let Tweet = this.getModel(boxid)
    if (this.isEmpty(query)) return Tweet.find().exec()
    else return this.findWithQuery(Tweet, query)
  }

  findNotWithQuery(Tweet) {

  }

  findWithQuery(Tweet, query) {
    let { currentPage, pageSize, sinceIndex } = query
    let skipnum = (currentPage - 1) * pageSize
    let sort = { index: -1 }
    let condition = {}
    if (sinceIndex) condition = { index: { $lte: sinceIndex } }
    return new Promise((resolve, reject) => {
      Tweet
        .find(condition)
        .skip(skipnum)
        .limit(parseInt(pageSize))
        .sort(sort)
        .exec((err, data) => {
          if (err) reject(err)
          data.reverse()
          Tweet.count({}, (err, total) => {
            if (err) reject(err)
            resolve({
              code: 0,
              pagination: {
                currentPage: parseInt(currentPage),
                pageSize: parseInt(pageSize),
                sinceIndex: parseInt(sinceIndex),
                total
              },
              data
            })
          })
        })
    })
  }

  isEmpty(obj) {
    if (Object.keys(obj).length) return false
    else return true
  }

  updateDeleteList(boxid, options) {
    let Tweet = this.getModel(boxid)
    return new Promise((resolve, reject) => {
      Tweet.updateMany({ index: { $in: options.data } }, { deleted: true }, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}

module.exports = new TweetServices()
