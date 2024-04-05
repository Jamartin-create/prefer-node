import { NextFunction, Request, Response } from 'express'
import { MError, generatorMError } from 'mduash'
import { ErrorRes } from '../plugin/response'
import Log from '../plugin/log'

// 错误码
export const ErrorCode = {
  TEST_ERROR: generatorMError(10001, '测试异常'),
  AUTH_TOKEN_ERROR: generatorMError(20001, '无权限：Token 失效'),
  EXCUTE_ERROR: generatorMError(99999, '执行异常')
}

/**
 * @description 异常捕获，链式调用结尾
 */
export function catchException(
  err: MError,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    Log.error(err.msg || err.message)
    // 权限问题单独处理
    if (err.name === 'UnauthorizedError') {
      res.send(ErrorRes(ErrorCode.AUTH_TOKEN_ERROR))
      return
    }
    let e = err instanceof MError ? err : ErrorCode.EXCUTE_ERROR
    res.send(ErrorRes(e))
  }
  next(err)
}
