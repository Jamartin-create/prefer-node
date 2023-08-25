import env from 'dotenv'

const NODE_ENV = process.env.NODE_ENV || 'dev'

env.config({
  path: `.env.${NODE_ENV}`,
})

export default {
  server: {
    port: 3460,
  },
}
