import { getServer } from './plugin/express'
import routes from './routes'

const server = getServer()

server.init()

server.app.use(routes) // 挂载路由

server.start()

console.log('Mdu-Express 模板')
