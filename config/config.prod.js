

module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523861872047_9217'

  // add your config here
  config.middleware = []

  // add mongoose
  config.mongoose = {
    client: {
      url: 'mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin',
      options: {
        server: {
          autoIndex: true, // Don't build indexes
          reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
          reconnectInterval: 500, // Reconnect every 500ms
          poolSize: 10, // Maintain up to 10 socket connections
          // If not connected, return errors immediately rather than waiting for reconnect
          bufferMaxEntries: 0,
          promiseLibrary: global.Promise,
        },
      },
    },
  }

  return config
}
