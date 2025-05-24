import { Router } from 'express';
import auth from './auth';

const routes = Router();

routes.use('/v1/auth', auth);

export default routes;
