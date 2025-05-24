import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function getResponse(code: number, msg: string, data?: any) {
    return {
        code,
        msg,
        data
    };
}

// 加密
export function pbkdf2(
    pwd: string,
    salt: string
): Promise<[any, string | null]> {
    return new Promise(resolve => {
        crypto.pbkdf2(
            pwd,
            salt!,
            310000,
            32,
            'sha256',
            function (err: any, hashedPassword: any) {
                if (err) return resolve([err, null]);
                resolve([null, hashedPassword.toString('hex')]);
            }
        );
    });
}

// 签发 token
export function jwtSign(data: any) {
    const options: jwt.SignOptions = {
        expiresIn: (process.env.SERVER_JWT_EXP || '24h') as any,
        jwtid: uuid()
    };

    return jwt.sign(data, process.env.SERVER_JWT_SALT || 'no', options);
}

// 校验 token
export function jwtVerify(token: string) {
    try {
        return jwt.verify(token, process.env.SERVER_JWT_EXP || '24h');
    } catch (e) {
        return false;
    }
}

export function uuid() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}
