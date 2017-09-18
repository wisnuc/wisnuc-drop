
const fs = require('fs')
const fe = require('fs-ext')
const uuid = require('uuid')

const target = process.cwd() + '/tmp/map'
var fd = fe.openSync(target, 'r')

class Cache {

	constructor(target) {
		this.target = target
	}

	writeFile(abbtrubites, counter) {
		console.log('Trying to aquire lock for the %s time', counter)
		fe.flockSync(fd, 'exnb')
		console.log('Aquired lock', counter)
		let data = fs.writeFileSync(this.target, JSON.stringify(abbtrubites))
		console.log(data)
		fe.flockSync(fd, 'un')
		console.log('unlock file', counter)
	}

	readFile(counter) {
		console.log('Trying to aquire lock for the %s time', counter)
		fe.flockSync(fd, 'exnb')
		let data = fs.readFileSync(this.target)
		let doc = JSON.parse(data)
		console.log('doc', doc)
		console.log('Aquired lock', counter)
		fe.flockSync(fd, 'un')
		console.log('unlock file', counter)
	}
}

let cache = new Cache(target)

cache.writeFile({ id: uuid.v4() }, 1)
console.log(1111111)
cache.writeFile({ id: uuid.v4() }, 2)
console.log(2222222)
cache.readFile(3)
console.log(3333333)
