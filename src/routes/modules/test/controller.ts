import { Request, Response } from 'express'
import TestService from './service'
import { Get, Controller, Post } from 'mduash/lib/decorators'

@Controller('/test')
export default class Test {
  @Get('/v1/nihao')
  getTest(req: Request, res: Response) {
    res.send(req.query)
  }
  @Get('/v1/pageList')
  getListByPage(req: Request, res: Response) {
    res.send(TestService.testPageList(req.query))
  }
  @Post('/v1/buhao')
  postTest(req: Request, res: Response) {
    res.send(req.body)
  }
}
