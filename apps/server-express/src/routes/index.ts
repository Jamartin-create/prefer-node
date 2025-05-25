import { NextFunction, Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import auth from './auth';
import swagger from '@/plugin/swagger';

const routes = Router();

routes.use('/v1/auth', auth);
routes.get('/v1/hello', (_, res) => res.send('hello world'));

routes.use(
    '/sapi/:password',
    (req: Request, res: Response, next: NextFunction) => {
        if (req.params.password !== 'lilmartin') {
            res.status(404);
            res.redirect('/404');
            return;
        }
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swagger)
);

export default routes;
