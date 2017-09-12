/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   worker.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: JianJin Wu <mosaic101@foxmail.com>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/09/07 14:21:48 by JianJin Wu        #+#    #+#             */
/*   Updated: 2017/09/12 17:52:39 by JianJin Wu       ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// TODO: cluster
const cluser = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length
const config = require('getconfig')
const port = config.port

// if (cluser.isMaster) {
//   for (let i = 0; i< numCPUs.length; i++) {
//     cluser.fork()
//   }
//   cluser.on('exit', (worker, code, signal) => {
//     console.log('Worker '+ worker.process.pid + ' died.')
//   })
// }
// else {
//   http.Server((req, res) => {
//     res.writeHead(200)
//     res.end('I am worker running in process ' + process.pid)
//   }).listen(port)
// }