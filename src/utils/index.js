// module.exports = {
//   JoiValidator: require('./joiValidator')
// }

const fs = require('fs')
const path = require('path')

let db = {}

let fileName = (file) => {
	console.log(file)
	return file.toString().split('.')[0]
}

fs
	.readdirSync(__dirname)
	.filter(function (file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js')
	})
	.forEach(function (file) {
		const model = path.join(__dirname, file)
		db[fileName(file)] = require(model)
	})



console.log(db)

module.exports = db
