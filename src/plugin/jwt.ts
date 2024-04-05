// import JWT from 'jsonwebtoken'
import { JWT } from 'mduash'
import config from '../config'

const { jwt } = config

const Jwt = new JWT(jwt.salt || 'mduash', '24h')

// 生成 token
export const sign = Jwt.sign

// 校验 token
export const verify = Jwt.verify

// 生成 Express 路由中间件
// @ts-ignore
export const jwtExpressMidware = Jwt.getExpressMidware(jwt.passurl)
