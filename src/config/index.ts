import env from 'dotenv'

const NODE_ENV = process.env.NODE_ENV || 'dev'

env.config({
  path: `.env.${NODE_ENV}`
})

export default {
  server: {
    port: 3460
  },
  jwt: {
    salt: process.env.JWT_SALT,
    expiresIn: process.env.JWT_EXPIRESIN,
    passurl: process.env.JWT_PASS_URL!.split(',').map(url => new RegExp(url))
  }
}
