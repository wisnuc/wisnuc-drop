# wisnuc-drop

Bridge Client and Nas.

## Folder Structure

```
.
├── config                   # 配置文件
├── doc                      # 项目文档
├── logs                     # 操作日志
├── node_modules             # 自定义中间件
├── out                      # jsdoc
├── src
  ├── bin                    # 启动脚本 node ./bin/www
  ├── lib                    # lib库
  ├── middlewares            # 自定义中间件
  ├── models                 # model层
  ├── routes                 # 路由层
  ├── schema                 # schema层
  ├── services               # 业务层
  └── utils                  # 工具层
├── test                     # 测试层     
└── tmp                      # 缓存层
```

## Required

- [mysql](https://dev.mysql.com/downloads/mysql)
- [mongo](https://www.mongodb.com/download-center#community)
- [nodejs](https://nodejs.org)

## Usage

### 1. Clone Repository
```bash
git clone https://github.com/wisnuc/wisnuc-drop.git
```
### 2. Install node_modules

#### binary package list: 
- ursa

```bash
cd wisnuc-drop && yarn install or npm install
```

### 3. Run Project

Run this project.

#### development environment
```bash
npm start
```
#### test environment
```bash
npm run test
```
#### production environment
```bash
pm2 start process.json
```

## API

[documentation](https://github.com/wisnuc/documentation)

### run api 
```bash
cd documentation && npm install
```
run cloud-client 
```bash
npm run cloud-client
```
run cloud-station 
```bash
npm run cloud-station
```

## Dependences

- Client depend on user, need to check token authorization firstly.
- Nas depend on station, need to check token authorization firstly.

## Test

- mocha

## Deployment

- node version - 8.5.0

## TODO List

- before/after
- database tables constructure document
- [sequelize migrations](https://sequelize.readthedocs.io/en/v3/docs/migrations)
- [qcloud databases backup](https://www.qcloud.com)
- station 握着2个 websocket

## Error Code

错误代码：
- 系统级别错误 // TODO
- 服务级别错误


http code 
```json
{
  "200": "ok",
  "400": "invalid parameters",
  "401": "authentication failed",
  "403": "forbidden",
  "404": "not found",
  "500": "system error"
}
```

服务级别错误， http code 都是 403， 并返回 json

```json
{
  "url": "/c/v1/tickets/694c4854-b63e-4a72-a4b8-5ec472427066",
  "code": 60202,
  "message": "ticket already expired",
  "data": null,
  "stack": "Error: ticket already expired\n    at TicketService.findByClient (/home/mosaic/mosaic/wisnuc-drop/src/services/ticketService.js:111:10)\n    at <anonymous>"
}
```

error code - such as: 60001，固定长度为5位整数！ 
服务级错误 | 服务模块代码 | 具体错误代码
----- | ------ | ------
6 		|	 00 	 | 01

服务级别错误代码说明

错误码(error code) | 错误信息(message)
----- | ------
60000 | user not exist
60001 | user already exist
60100 | station not exist
60101 | station already exist
60200 | ticket not exist
60201 | ticket already exist
60202 | ticket already expired
60203 | ticket_user not exist
60204 | ticket_user already exist
60300 | pipe: response time over 15s
60301 | pipe: client response already finished
60302 | pipe: too much processing tasks 
60310 | fetchFile queue have`t server
60320 | storeFile queue have`t server
60321 | no manifest field
60322 | form error
60330 | transformJson queue have`t server
60400 | server not exist
60401 | server already exist
