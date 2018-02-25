# MQTT Topic Design

mqtt 的 客户端(client) 现有 pc、ios、andriod、mini program、cloud、station 五端，其中 pc、ios、andriod、mini program  统称为 client。

已有消息通知流程：

> cloud => client

> cloud => station

> station => cloud 



## Connect

client connect settings.

### Mqtt URL

test 

```json
mqtt://test.siyouqun.com:1883
```

prod

```json
mqtt://mqtt.siyouqun.com:1883
```



### ClientId

每个 client  端需要自己生成唯一的标识符以便 mqtt service 统计识别。

client 规范为：固定字符串 + 唯一标识符

以下是一些实例: 

#### Pc

```json

'client_pc_' + userId
```

#### Ios

```json
'client_ios_' + userId
```

#### Andriod

```json
'client_android_' + userId
```

#### Mini Program

```json
'client_mini_' + userId
```

#### Cloud

```json
'cloud_' + Math.random().toString(16).substr(2, 8)
```

#### Station

```json
'station_' + stationId
```

### Settings

```json
{
  clientId: 'cloud_' + Math.random().toString(16).substr(2, 8),
  clean: true,
  keepalive: 3,
  reconnectPeriod: 5 * 1000,
  connectTimeout: 10 * 1000
}
```



## Cloud => Client

cloud publish message to client , when box operate and have new tweet.

#### 1. client/user/{userId}/box

```json
// payload
[
  {
    "id": "5a77fd3b35dfc7f1061bc976",
    "uuid": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
    "name": "私有群",
    "owner": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
    "users": [
      {
        "id": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
        "status": 1,
        "nickName": "mosaic",
        "avatarUrl": "https://wx.qlogo.cn"
      }
    ],
    "stationId": {
      "id": "6e6c0c4a-967a-489a-82a2-c6eb6fe9d991",
      "name": "WISNUC_1513060364831",
      "LANIP": "192.168.8.128",
      "isOnline": 1,
      "status": 1
    },
    "ctime": 1515996040812,
    "mtime": 1515996040812,
    "tweet": {
      "id": "5a77fd3b35dfc7f1061bc976",
      "uuid": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
      "type": "blob",
      "comment": "hello",
      "commitId": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
      "index": 1,
      "parent": 0,
      "tweeter": "f0066784-7985-4dc4-9b20-4ea5a14434e8",
      "ctime": 1515996040812,
      "list": []
    }
  }
]
```



## Cloud => Station

- transform json
- fetch file
- store file

station/{stationId}/pipe

```json
// payload
{ 
  method: 'GET',
  resource: 'L3VzZXJz',
  body: {},
  sessionId: '62bacb4d-d746-4859-86ba-1a80508fd61d',
  user: { 
    id: 'b20ea9c9-c9a6-4a4f-adde-c8f7c1c11884',
    nickName: 'L',
    unionId: undefined 
  },
  type: 'pipe', // json、fetch、 store
  serverAddr: '10.10.9.87:4000'
}
```



## Station => Cloud

- station offline
- station online



