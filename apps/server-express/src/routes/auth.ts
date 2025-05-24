import { Router } from 'express';
import passport from '@/plugin/passport';
import { getResponse, jwtSign } from '@/utils/common';
import { singup } from '@/service/auth';

const routes = Router();

routes.post('/login/password', function (req, res, next) {
    passport.authenticate('local', function (err: any, user: any, info: any) {
        if (err) return next(err);
        if (!user) {
            return res.send(getResponse(401, info.message));
        }
        res.send(
            getResponse(0, 'ok', {
                user,
                auth: { token: jwtSign({ id: user.id }) }
            })
        );
    })(req, res, next);
});

routes.post('/signup', async function (req, res, next) {
    try {
        await singup(req.body);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});

export default routes;
