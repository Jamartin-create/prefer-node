import { Router } from 'express';

const routes = Router();

routes.get('/hello', (_, res) => {
    res.send('world');
});

export default routes;
