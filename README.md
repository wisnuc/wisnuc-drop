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

## Develop

## Dependences

- Client depend on user, need to check token authorization firstly.
- Nas depend on station, need to check token authorization firstly.

## Test

- mocha


## TODO

- before/after
- database tables constructure document
- [sequelize migrations](https://sequelize.readthedocs.io/en/v3/docs/migrations)
- [qcloud databases backup](https://www.qcloud.com)

