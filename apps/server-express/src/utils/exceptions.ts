import { NextFunction, Request, Response } from 'express';
import Log from '../plugin/log';

class CustomError extends Error {
    code: number;
    msg: string;
    constructor(code: number, msg: string) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }
}
function ErrorFactory(code: number, msg: string) {
    return new CustomError(code, msg);
}

// 错误码
export const ErrorCode = {
    TEST_ERROR: ErrorFactory(10001, '测试错误'),
    EXCUTE_ERROR: ErrorFactory(10002, '执行错误')
};

function ErrorRes(e: CustomError) {
    return {
        code: e.code,
        msg: e.msg
    };
}

/**
 * @description 异常捕获，链式调用结尾
 */
export function catchException(
    err: CustomError,
    _: Request,
    res: Response,
    next: NextFunction
) {
    if (err) {
        Log.error(err.msg || err.message);
        // 权限问题单独处理
        if (err.name === 'UnauthorizedError') {
            res.send();
            return;
        }
        let e = err instanceof CustomError ? err : ErrorCode.EXCUTE_ERROR;
        res.send(ErrorRes(e));
    }
    next(err);
}
