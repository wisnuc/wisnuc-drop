
const fs = require('fs')
const fe = require('fs-ext')
const uuid = require('uuid')

const target = process.cwd() + '/tmp/map'

/**
 * 可以读写操作的小型数据库
 * @class Database
 */
class Database {
	_write(abbtrubites, counter) {
		const fd = fe.openSync(target, 'r')
		console.log('Trying to aquire lock for the %s time', counter)
		fe.flockSync(fd, 'exnb')
		console.log('Aquired lock', counter)
		let data = fs.writeFileSync(this.target, JSON.stringify(abbtrubites))
		console.log(data)
		fe.flockSync(fd, 'un')
		console.log('unlock file', counter)
	}

	_read(counter) {
		const fd = fe.openSync(target, 'r')
		console.log('Trying to aquire lock for the %s time', counter)
		fe.flockSync(fd, 'exnb')
		let data = fs.readFileSync(this.target)
		let doc = JSON.parse(data)
		console.log('doc', doc)
		console.log('Aquired lock', counter)
		fe.flockSync(fd, 'un')
		console.log('unlock file', counter)
	}
	/**
	 * key is unique identifier
	 * @param {string} key 
	 * @param {any} value 
	 * @memberof Database
	 */
	set(key, value) {
		const fd = fe.openSync(target, 'r')
		console.log('Trying to aquire lock for the %s time', key)
		fe.flockSync(fd, 'exnb')
		let data = fs.readFileSync(fd)
		let doc = JSON.parse(data)
		console.log('doc', doc)
		console.log('Aquired lock', key)
		fe.flockSync(fd, 'un')
		console.log('unlock file', key)
	}
	get(key) {
		const fd = fe.openSync(target, 'r')
		console.log('Trying to aquire lock for the %s time', key)
		fe.flockSync(fd, 'exnb')
		let data = fs.readFileSync(fd)
		let doc = JSON.parse(data)
		console.log('doc', doc)
		console.log('Aquired lock', key)
		fe.flockSync(fd, 'un')
		console.log('unlock file', key)
	}
}

let database = new Database()

database.set(uuid.v4(), 22222)
console.log(3333333)
