module.exports = {
	"env": {
		"es6": true,
		"node": true,
		"mocha": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module",
		"ecmaVersion": 8
	},
	"rules": {
		// "no-console": "off",
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"never"
		]
	}
}
