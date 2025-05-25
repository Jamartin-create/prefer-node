import { Router } from 'express';
import auth from './auth';

const routes = Router();

routes.use('/v1/auth', auth);
routes.get('/v1/hello', (_, res) => res.send('hello world'));

export default routes;
