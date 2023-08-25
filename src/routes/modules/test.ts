import { Router } from 'express'
import { AppRouter } from '../../plugin/express'

const routes = Router()

routes.get('/v1/nihao', (req, res) => {
  res.send(req.query)
})

routes.post('/v1/nihao', (req, res) => {
  res.send(req.body)
})

AppRouter.getInstance().use('/test', routes)
