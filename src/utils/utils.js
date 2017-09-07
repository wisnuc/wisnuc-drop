/**
 * Created by wujj on 2016/10/24.
 */
const request = require('request')
const _ = require('lodash')
const config = require('getconfig')
const Logger = require('../utils/logger').Logger('utils-request')

/**
 * 请求通用方法
 * @param options {object}
 *              {
 *                  url:请求url
 *                  method:请求方法 get post等
 *              }
 * @times times {Number} 次数
 * @returns {*}
 */
exports.sendRequest = (options, times) => {
	times = times || 0
	if (times <= 3) {
		times++
	} else {
		Logger.error(JSON.stringify(options), '三次同步均失败')
		return Promise.resolve()
	}
	Logger.info('request:   ' + JSON.stringify(options) + ' times:' + times)
	//请求数据
	return new Promise((resolve, reject) => {
		if (!options || !options.method || !options.url) {
			return reject(Error('请求参数错误!'))
		}
		let requestOp = {
			method: options.method,
			url: config.es_url + options.url,
			form: options.form || null,
			timeout: options.timeout || 10000
		}
		request(requestOp, (error, response, body) => {
			if (error) {
				return reject(Error('请求失败，请稍候重试!'))
			}
			//返回失败，再次尝试
			if (response && response.statusCode != 200 || !body) {
				return sendRequest(options, times)
					.then(resolve)
					.catch(reject)
			}
			return resolve(JSON.parse(body))
		}
		)
	})
}

/**
 * 【数据转化为json】
 * @condition   通过Sequelize获取的模型对象都是一个DAO（Data Access Object）对象，
 *              这些对象会拥有许多操作数据库表的实例对象方法（比如：save、update、destroy等），
 *              需要获取“干净”的JSON对象可以调用get({'plain': true})。
 * @param options {object}
 * @support 支持 find、findAll、findAndCountAll
 */
exports.dataToJSON = function (options) {
	if (!options) {
		throw Error('参数缺失！')
	}
	let data = []
	if (_.isArray(options)) {
		for (let option of options) {
			data.push(option.get({ 'plain': true }))
		}
		return data
	} else if (_.isObject(options) && options.rows) {
		for (let option of options.rows) {
			data.push(option.get({ 'plain': true }))
		}
		return {
			count: options.count,
			rows: data
		}
	} else if (_.isObject(options)) {
		return options.get({ 'plain': true })
	} else {
		throw Error('参数类型错误！')
	}
}
