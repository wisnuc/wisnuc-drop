const mongoose = require('mongoose')

const BlackListSchema = mongoose.Schema({
	boxid: String,
	data: Array
})

module.exports = mongoose.model('blackList', BlackListSchema)