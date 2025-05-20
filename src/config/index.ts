import env from 'dotenv'
import type { Dialect } from 'sequelize'

const NODE_ENV = process.env.NODE_ENV || 'dev'

env.config({
  path: `.env.${NODE_ENV}`
})

export default {
  server: {
    port: process.env.SERVER_PORT
  },
  jwt: {
    salt: process.env.JWT_SALT,
    expiresIn: process.env.JWT_EXPIRESIN,
    passurl: process.env.JWT_PASS_URL
      ? process.env.JWT_PASS_URL.split(',').map(url => new RegExp(url))
      : []
  },
  mysql: {
    database: process.env.MYSQL_DB_NAME,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD,
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    dialect: process.env.MYSQL_DIALECT as Dialect,
    timezone: process.env.MYSQL_TIMEZONE,
    loggin: console.log
  }
}
