# wisnuc-drop
wechat small program server

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

# Features

- install mysql
- install mongo
- node version >= 7.6.0 
- secure dependency management [yarn](https://github.com/yarnpkg/yarn)

# Install

```bash
git clone https://github.com/wisnuc/wisnuc-drop.git
cd wisnuc-drop
npm install or yarn install
```

- development environment
```bash
npm start
```

- production environment
```bash
pm2 start process.json
```


