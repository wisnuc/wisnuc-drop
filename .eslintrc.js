module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};


// http://eslint.org/docs/user-guide/configuring

// module.exports = {
// 	env: {
//     es6: true,
// 		node: true,
// 		mocha: true
//   },
//   parserOptions: {
// 		sourceType: 'module',
// 		ecmaVersion: 8
//   },
//   extends: 'eslint:recommended',
//   'rules': {
// 		quotes: [
// 			'error',
// 			'single'
// 		],
// 		semi: [
// 			'error',
// 			'never'
// 		]
//   }
// }
