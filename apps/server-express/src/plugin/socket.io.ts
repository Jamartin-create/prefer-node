import http from 'http';
import { Server, Socket } from 'socket.io';
import { getCache, setCache } from './redisCache';
import { globLogger } from './logger';

let instance: Server | undefined;

export const REDIS_LIST_KEY = 'ws:sockets';
export const REDIS_DICT_KEY = 'ws:sockets:dict';

export function mountSocket(server: http.Server) {
    instance = new Server(server);

    instance.on('connection', (socket: Socket) => {
        socket.on('join', ({ user }) => {
            if (!user.id) {
                globLogger.info(`user not found`);
                return;
            }

            const sockets: any = getCache(REDIS_LIST_KEY) || {};
            const socketsDict: any = getCache(REDIS_DICT_KEY) || {};

            socketsDict[socket.id] = user.id;

            if (sockets[user.id]) {
                sockets[user.id].socket_ids.push(socket.id);
            } else {
                sockets[user.id] = {
                    user,
                    socket_ids: [socket.id]
                };
            }

            console.log(JSON.stringify(sockets));

            setCache(REDIS_LIST_KEY, sockets);
            setCache(REDIS_DICT_KEY, socketsDict);
            globLogger.info(
                `#${user.id}:${user.username} connect ws @${socket.id}`
            );
        });

        socket.on('disconnect', reason => {
            const sockets: any = getCache(REDIS_LIST_KEY);
            const socketsDict: any = getCache(REDIS_DICT_KEY);

            const userId = socketsDict[socket.id];

            if (!sockets[userId]) {
                globLogger.info(`Socket not found`);
                return;
            }

            const sids = sockets[userId].socket_ids.filter(
                (i: string) => i !== socket.id
            );
            sockets[userId] = sids;

            if (sids.length === 0) delete sockets[userId];

            setCache(REDIS_LIST_KEY, sockets);
            setCache(REDIS_DICT_KEY, socketsDict);

            globLogger.info(`Socket disconnected: ${socket.id} (${reason})`);
        });

        socket.on('error', err => {
            globLogger.error(`Socket error: ${socket.id}`, err);
        });
    });
}

export function getIo(): Server | null {
    if (!instance) return null;
    return instance;
}
