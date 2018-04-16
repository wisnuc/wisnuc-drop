# wisnuc-drop
Bridge Client and Nas.
Rebuild with eggjs.

- [Introduction](doc/introduction.md)
- [Installation](doc/installation.md)
- [Deployment](doc/deployment.md)
- [API Doc](doc/api_doc.md)
- [test](doc/test.md)
- [MQTT](doc/mqtt.md)

# TODO List

- tweet大小限制（mqtt 只能一次性传 64k 数据）
- mysql migrate to mongodb
- add tweet bug （index 冲突）
- version control (方便小程序审核发布以及app升级)
- *complete doc(doing)
- *project test
- *system monitor
- *config settings
- *resolve the problem that mini program connect MQTT broker
- upload file with udp
- database tables constructure document
- swagger mock
- mongoDB transaction
- mini program => hpps pictures
- [management system](https://github.com/wisnuc/wisnuc-management)
- [sequelize migrations](https://sequelize.readthedocs.io/en/v3/docs/migrations)
- [qcloud databases backup](https://www.qcloud.com)

## JsDoc
```bash
npm run doc && open ./out/index.html with browser
```

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
