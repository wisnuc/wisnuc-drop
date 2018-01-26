const mongoose = require('mongoose')

const BlackListSchema = mongoose.Schema({
  boxid: String,
  data: Array
}, {
  timestamps: true
})

module.exports = mongoose.model('blackList', BlackListSchema)
