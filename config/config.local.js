

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
  // mqtt
  config.mqtt = {
    url: 'mqtt://127.0.0.1:1883',
  }
  // wechat
  config.wechat = {
    web: {
      appid: 'wxd7e08af781bea6a2',
      appSecret: '05ec391572c66dcf0cc0c843da5d96e3',
    },
    mobile: {
      appid: 'wx99b54eb728323fe8',
      appSecret: '0a997d6d0a5484f295fd590aeeba95d5',
    },
    mp: {
      appid: 'wxdbffdf5ccfd5ccaa',
      appSecret: 'e11bbc47d2abb6d97574a0cb4cd800f3',
    },
  }
  return config
}
