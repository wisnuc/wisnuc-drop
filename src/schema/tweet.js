const mongoose = require('mongoose')

const TweetSchema = mongoose.Schema({
	uuid: String,
	tweeter: {},
	ctime: Number,
	comment: String,
	type: String,
	id: String,
	list: [],
	index: {type: Number, index:true},
	deleted: Boolean
})

module.exports = boxid => mongoose.model(boxid + '-tweet', TweetSchema)