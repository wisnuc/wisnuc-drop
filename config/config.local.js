

module.exports = () => {
  const config = exports = {}
  // add mongoose
  config.mongoose = {
    client: {
      url: 'mongodb://mongouser:nw9zuwMgN6fjs6@122.152.206.50:27017/drop_test?authSource=admin',
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

  config.mqtt = {
    url: 'mqtt://127.0.0.1:1883',
  }

  return config
}
