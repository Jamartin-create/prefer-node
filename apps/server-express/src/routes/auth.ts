import { Router } from 'express';
import { sendVerifyCode, signin, singup, sigininByEmail } from '@/service/auth';

const routes = Router();

routes.post('/login/:type', async function (req, res, next) {
    const { type } = req.params;

    try {
        if (type === 'password') {
            // Use the existing signin function for password login
            signin(req, res, next);
        } else if (type === 'email') {
            const { email, code } = req.body;
            if (!email || !code) {
                res.send({ code: 400, msg: '缺少邮箱或验证码' });
                return;
            }
            const result = await sigininByEmail(email, code);
            res.send({ code: 0, msg: 'ok', data: result });
        } else {
            res.send({ code: 400, msg: '无效的登录类型' });
        }
    } catch (e) {
        next(e);
    }
});

routes.post('/signup', async function (req, res, next) {
    try {
        await singup(req.body);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});

routes.post('/mail/code/:type', async function (req, res, next) {
    try {
        await sendVerifyCode(req.body.email, req.params.type);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});

export default routes;
