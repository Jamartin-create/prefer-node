import express from 'express'
import cors from 'cors'
import http from 'http'
import config from '../config'

const { server } = config

export default class ExpressServer {
  app: express.Application
  server: http.Server
  init: () => void
  start: () => void
  constructor() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.init = () => {
      this.app.use(cors())
      this.app.use(express.json())
      this.app.use(express.urlencoded({ extended: true }))
      this.app.get('/test/v1/hello', (_, res: express.Response) =>
        res.send('world')
      )
    }
    this.start = () => {
      this.server.listen(server.port, () => {
        console.log('Mdu-Express，已启动，监听端口：' + server.port)
      })
    }
  }
}

// 获取 Server 实例
export const getServer: () => ExpressServer = (function () {
  let server: null | ExpressServer = null
  return function () {
    if (!server) server = new ExpressServer()
    return server
  }
})()
