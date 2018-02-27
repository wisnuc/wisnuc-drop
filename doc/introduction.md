# 介绍 (Introduction)
todo

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

## Dependences
- Client depend on user, need to check token authorization firstly.
- Nas depend on station, need to check token authorization firstly.
