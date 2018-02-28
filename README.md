# wisnuc-drop
Bridge Client and Nas.

- [介绍](doc/introduction.md)
- [安装](doc/installation.md)
- [部署](doc/deployment.md)
- [API Doc](doc/api_doc.md)
- [test](doc/test.md)
- [TODO List](doc/todo_list.md)

## Mqtt Topic
mqtt topic 使用说明

### For Station
主题(topic) | 数据(json) | 说明(description)
----------------- | ------------------ | ------------------
station/${stationId}/pipe | {} | json、fetch、 store

## JsDoc
```bash
npm run doc && open ./out/index.html with browser
```
