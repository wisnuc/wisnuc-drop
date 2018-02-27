接口文档 (API DOC)
todo


## API
batch operations extend to restful api. 
```json
body: {
  "create":  "[array of models to create]",
  "update":  "[array of models to update]",
  "destroy": "[array of model ids to destroy]"
}
```
- [old documentation](https://github.com/wisnuc/documentation) *deprecated*
- [new documentation](http://test.siyouqun.com/api-docs)


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
60210 | user of ticket not exist
60211 | user of ticket already exist
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
60500 | box not exist
60501 | box already exist
60510 | user of box not exist
60511 | user of box already exist
60600 | tweet not exist
60601 | tweet already exist
