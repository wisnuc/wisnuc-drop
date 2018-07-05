/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lib.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: Jianjin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/07/24 10:53:26 by Jianjin Wu        #+#    #+#             */
/*   Updated: 2018/07/05 17:41:49 by Jianjin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const jwt = require('src/lib/jwt')
const {	User, Station, Server } = require('src/models')


const USERS = {
  mosaic: {
    _id: 'c4d249dd-ed57-4655-9497-2a93ae3af1d0',
    unionId: 'oOMKGwt3tX67LcyaG-IPaExMSvDx',
    nickName: 'mosaic',
    avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epetUHR5HCOBJTl1fon9e7zDIk93UpRsicWLYYhIbaSFYpRdhszp5yiaUbzolia4gdeZnKjLXlEmAicFA/132',
    stations: [ 
      '4303984e-6f32-422b-8eda-11a050a1dd37', 
      '0014787b-0b7e-4359-ae3b-da9c61f42106'
    ],
    status: 1
  },
  jackYang: {
    _id: 'd9a50642-5e28-4338-b714-a87d09c660b5',
    unionId: 'oOMKGwveI2u10xIVhhI3b9SMnurD',
    nickName: 'JackYang',
    avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJJQYnrTXgWgrlSfSto6QfRIY3t9gOVp3Da6ia8eNhgttK1nK7yk9VkmiaTYOU6SqeXYOhFNzqQ4ZMQ/0',
    stations: [ 
      '4303984e-6f32-422b-8eda-11a050a1dd37', 
      '0014787b-0b7e-4359-ae3b-da9c61f42106'
    ],
    status: 1
  }
}

const STATIONS = {
  homeStation: {
    _id: '4303984e-6f32-422b-8eda-11a050a1dd37',
    status: 1,
    name: 'homeStation',
    users: [ 
      'c4d249dd-ed57-4655-9497-2a93ae3af1d0', 
      '284b77ea-fcc2-40bd-aa0f-7d576c4ae8f5'
    ],
    publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5ugk4G0Do5hGtyBD20QX\niX6XgmauiEMJojfM5wcWJjw1fs3yHeA6uAD/FPcO9EQCM9UGbg8nW4WR6wP9jjgA\n/5K6bh4Vmyg3kGNBBD7qr+NdiOhYZjgh23/QtLmnW13q5LqtP2W1NR+TPBxti/y7\ng1iPUkNAikGT0b9Zfthowt0j17eY/9u/vA7zIFiL0XMsdqnzwCLZkfO0BhxK0dSk\nE63xWoezLEtHO6Prk363B97vZ+rwGBHpKHVq35SfJiMkAf0Qv5MzLXKthgH2L7PA\nB2uC/xYhxFNsm5k5Y+UWEmhb3xQuKr3Qe7c+XfGes9N7CpaL/HVS+6CWOodA+z8m\nfwIDAQAB\n-----END PUBLIC KEY-----\n',
    LANIP: '10.10.9.229',
    isOnline: false
  },
  'companyStation': {
    _id: '0014787b-0b7e-4359-ae3b-da9c61f42106',
    status: 1,
    name: 'companyStation',
    users: [ 
      'c4d249dd-ed57-4655-9497-2a93ae3af1d0', 
      '284b77ea-fcc2-40bd-aa0f-7d576c4ae8f5'
    ],
    publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA29rzmUenNrbMB0cz1Gvw\nVG6t5Pw79ugFWahyoAC2t81Kv1zQgGwKMUB5t7PcyXuqiLO5a8GzumeBaI62M3y+\nAK3q1Bya9c1ImUiAbOoF/jYGY1NrPFWOxh1/sErmc7EZidWVe0DjYFgbue/WvTWn\ntf7Juawg+UwaFJFTuJWc1dvSZxfVq9sED0aKQCR5TffxI8ni8hA47LnfjVDHAdTH\n1AnlnGrBgvxyYl5MSlS7Mpev/wiijpvV2VQd1FYH1VcVGzuuQj3HJA7wlGC6Bi2l\nvxwSGQWlH/VQvjXE0oPD8hEuQ1HCNfomKRI+4jLVk3wjIuzT5FzJW5eNUT3nY8Rb\nFQIDAQAB\n-----END PUBLIC KEY-----\n',
    LANIP: '192.168.31.101',
    isOnline: false
  }
}

const SERVERS = {
  server_1: {
    _id: '1f48e7c2-a04f-4cd5-94c4-04da1428d315',
    WANIP: '10.10.9.59',
    LANIP: '10.10.9.59'
  },
  server_2: {
    _id: '08db5845-3377-4504-9f5f-8016928f3318',
    WANIP: '10.10.9.81',
    LANIP: '10.10.9.81'
  }
}

const TICKETS = {
  bind: {
    _id: '7700c7d1-9289-4c58-80da-71fd27842eb5',
    type: 'bind',
    stationId: undefined,
    data: 123456
  },
  invite: {
    _id: '4efe06ac-4b99-48d7-82f2-ed1a47d2e307',
    type: 'invite',
    creator: undefined,
    stationId: undefined,
    data: 123456
  },
  share: {
    _id: 'c1d6f74c-3380-4778-a983-6e6e324e7734',
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

const cToken = jwt.encode({ user: USERS['mosaic'] })
const sToken = jwt.encode({ station: STATIONS['station_1'] })

const createUser = () => {

}
module.exports = {
  USERS,
  STATIONS,
  TICKETS,
  SERVERS,
  BOXES,
  FILES,
  cToken,
  sToken
}
