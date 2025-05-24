import { Router } from 'express';
import { signin, singup } from '@/service/auth';

const routes = Router();

routes.post('/login/password', signin);

routes.post('/signup', async function (req, res, next) {
    try {
        await singup(req.body);
        res.send({ code: 0, msg: 'ok' });
    } catch (e) {
        next(e);
    }
});

export default routes;
