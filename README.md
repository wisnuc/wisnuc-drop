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

## Error Code

response 
```json
{
    "code": 403,
    "message": "您已提交过申请，请等待管理员审核结果！",
    "data": null,
    "stack": "Error: 您已提交过申请，请等待管理员审核结果！\n    at WisnucDB.transaction (/home/mosaic/mosaic/wisnuc-drop/src/services/ticketService.js:177:27)\n    at <anonymous>"
}
```

错误码 | 错误信息
----- | ------
errcode | errmsg
111 | dfff