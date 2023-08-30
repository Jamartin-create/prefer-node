import { getServer } from './plugin/express'
import { catchException } from './utils/exceptions'
import routes from './routes'

const server = getServer()

server.init()

server.app.use(routes) // 挂载路由
server.app.use(catchException) // 全局异常捕获

server.start()

console.log('Mdu-Express 模板')
