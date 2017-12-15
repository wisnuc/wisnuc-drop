/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/24 10:53:26 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/12/15 17:13:19 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('src/lib/jwt')
const {
	User,
  Station,
  Server,
  sequelize
} = require('src/models')


const USERS = {
  mosaic: {
    id: '03f3abf9-fe3e-4e9b-a6f5-5e53ef9fd1a5',
    unionId: 'oOMKGwt3tX67LcyaG-IPaExMSvDw',
    nickName: 'mosaic',
    avatarUrl: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaELMY20dSuicj4uXzO4ok9mu7Zvkh27IgomrfE65pBNV4K98NclHDfEurHUou2Yhm2CjLHXfE7amndQ/0'
  },
  jackYang: {
    id: 'd9a50642-5e28-4338-b714-a87d09c660b6',
    unionId: 'oOMKGwveI2u10xIVhhI3b9SMnurw',
    nickName: 'JackYang',
    avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJJQYnrTXgWgrlSfSto6QfRIY3t9gOVp3Da6ia8eNhgttK1nK7yk9VkmiaTYOU6SqeXYOhFNzqQ4ZMQ/0'
  }
}

const STATIONS = {
  'station_1': {
    id: 'b185e9e4-9665-4a89-b35d-08b7b9b08c8a',
    name: 'station_1',
    publicKey: 'publicKey_1',
  },
  'station_2': {
    id: '3b8e7dd1-c232-48e8-98b3-7ce3f064dce5',
    name: 'station_2',
    publicKey: 'publicKey_2',
  }
}

const SERVERS = {
  'server_1': {
    id: '1f48e7c2-a04f-4cd5-94c4-04da1428d315',
    WANIP: '10.10.9.59',
    LANIP: '10.10.9.59'
  },
  'server_2': {
    id: '08db5845-3377-4504-9f5f-8016928f3318',
    WANIP: '10.10.9.81',
    LANIP: '10.10.9.81'
  }
}

const TICKETS = {
  bind: {
    id: '7700c7d1-9289-4c58-80da-71fd27842eb5',
    type: 'bind',
    stationId: undefined,
    data: 123456
  },
  invite: {
    id: '4efe06ac-4b99-48d7-82f2-ed1a47d2e307',
    type: 'invite',
    creator: undefined,
    stationId: undefined,
    data: 123456
  },
  share: {
    id: 'c1d6f74c-3380-4778-a983-6e6e324e7734',
    type: 'share',
    creator: undefined,
    stationId: undefined,
    data: 123456
  }
}

const BOXES = {}

const FILES = {
  account: {
    name: 'account.md',
    path: 'tmp/account.md',
    size: 103005,
    hash: 'fb3273052fc288683504bb454172ded50802dc4ec068edb43480539ceebdf29b'
  },
  http: {
    name: 'http.pdf',
    path: 'tmp/http.pdf',
    size: 89259239,
    hash: 'c03e5c4367554baa5e12916758b4587dc8d4c1070caba921a7e42ac6dc102af9'
  },
  ubuntu: {
    path: 'tmp/ubuntu.iso',
    size: 4162242560,
    hash: '02aef95802ca66f5b03fa0122ae4aa9ccc584c985e6eaa5f05dc3953f8031db3'
  }
}

const createAsync = async () => {

}

const resetAsync = async () => {
  await sequelize.sync({ force: true })
}
const cToken = jwt.encode({ user: USERS['mosaic'] })
const sToken = jwt.encode({ station: STATIONS['station_1'] })

module.exports = {
  USERS,
  STATIONS,
  TICKETS,
  SERVERS,
  BOXES,
  FILES,
  cToken,
  sToken,
  createAsync,
  resetAsync
}
