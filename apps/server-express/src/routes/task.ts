import { Router } from 'express';
import { getIo, REDIS_LIST_KEY } from '@/plugin/socket.io';
import { getCache } from '@/plugin/redisCache';

const routes = Router();

routes.post('/todo', async (req, res) => {
    if (!req.user) {
        res.send({ code: 401, msg: '会话已过期' });
        return;
    }
    const io = getIo();
    if (!io) {
        res.send({ code: 400, msg: 'socket 服务异常' });
        return;
    }
    const sockets: any = await getCache(REDIS_LIST_KEY);
    console.log(req.user, JSON.stringify(sockets));
    const socket = sockets[(req.user as any).id!];
    if (!socket) {
        res.send({ code: 400, msg: '未找到目标连接' });
        return;
    }

    res.send({ code: 0, msg: 'ok' });
});

export default routes;
