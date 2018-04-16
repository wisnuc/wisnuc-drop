

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523861872047_9217'

  // add your config here
  config.middleware = []

  return config
}
