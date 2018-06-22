

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523861872047_9217'

  config.security = {
    csrf: {
      ignore: '/c/*/*',
    },
  }
  // debug 为 true 时，用于本地调试
  // config.debug = true

  // add your config here
  config.middleware = [ 'resFormat', 'joiValidate' ]

  config.resFormat = {
    enable: true,
    match: '/',
  }

  config.validateJoi = {
    options: {
      abortEarly: false,
    },
  }

  return config
}
