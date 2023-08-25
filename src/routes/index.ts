import { Router } from 'express'
import { AppRouter } from '../plugin/express'
import './modules/test'
import jwt from '../plugin/jwt'

const routes = Router()

routes.use(jwt.midwareExpressJwt) // 鉴权校验中间件

routes.use(AppRouter.getInstance()) // 挂载路由

export default routes
