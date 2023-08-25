import { getServer } from './plugin/express'

const server = getServer()

server.init()
server.start()

console.log('Mdu-Express 模板')
