
# stations

INSERT INTO `drop_test`.`stations`
(
	`id`, `name`, `publicKey`, `status`, `isOnline`, `createdAt`, `updatedAt`
)
VALUES
(
	'05245d90-fc9b-42c3-b309-d9a09c58f72b','station_1502071625974', '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvyKrlhfU0saAacTNy1YC\n9eKP6b6VtjwOmM8+o63+sC7svnLfi4O/qHkTxemGY5c1WKR6ny/90aQaIJEVaZDs\n/DAx9sE7oXU05/elELMS70SR53evJNGLjLgb7pkObGU91vZr1s9BLg8R9dT9WdSV\nqrhWAluiAXRU80B+f3Ojbb3Vm1KqTxCcKEvl5AexJkRbqxWffrr4xf9lEf4xy93Q\nT/QjxH6Ksm8hTGAKd5mDZVvN7PxythgErOC75jK9JYHoHPtbblh/eR9p5bDTbkqU\nzbpm0QLoPMS8ttifkhE6NJsoq9AsnSE7CBui/1DT8aOz9ovwdCHfLZ4VbgwLQq8K\nhwIDAQAB\n-----END PUBLIC KEY-----\n', '1', '0', '2017-08-07 10:07:47', '2017-08-07 10:07:47'
)

# users

INSERT INTO `drop_test`.`users`
(
	`id`, `status`, `password`, `email`, `phoneNO`, `unionId`, `nickName`, `avatarUrl`, `createdAt`,`updatedAt`
)
VALUES
(
	'6e6c0c4a-967a-489a-82a2-c6eb6fe9d991', '1', NULL, NULL, NULL, 'oOMKGwjtQBp1bCEj88FMotdQCuMw', '刘华', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJBsJR1DhjgRbUKk9adPdl8TfmLj2roOlNQc0alnAySqD56HCeBd7PU5TNBxlfAqqX4ficialTRl9LA/0', '2017-07-26 10:40:51', '2017-07-26 10:40:51'
)

# user_station

INSERT INTO `drop_test`.`user_station`
(
	`id`, `userId`, `stationId`, `status`, `createdAt`,`updatedAt`
)
VALUES
(
	'8c8b31bf-cf16-4ca2-909a-b66e39d1ef5c', '6e6c0c4a-967a-489a-82a2-c6eb6fe9d991', '05245d90-fc9b-42c3-b309-d9a09c58f72b', '1', '2017-07-28 11:40:11', '2017-07-28 11:40:11'
)


