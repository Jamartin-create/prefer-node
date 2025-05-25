import passport from 'passport';
import { getCache, setCache } from './redisCache'; // 导入中间文件的方法
import { globLogger } from './logger';

passport.serializeUser(function (user: any, cb) {
    cb(null, { id: user.id, username: user.username, email: user.email });
});

passport.deserializeUser(async function (user: any, cb) {
    const cacheKey = `session:user-cache:${user.id}`;
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
        // 如果缓存存在，直接使用缓存数据
        globLogger.info(`Cache hit for user ${user.id}`);
        cb(null, cachedUser);
    } else {
        // 为了保证即使没有 Redis 也能工作，这里暂时直接使用 serializeUser 传过来的 user 对象
        // 实际应用中，这里应该是从数据库加载的完整用户对象
        const fullUser = user; // 模拟从数据库加载

        // 将从数据库加载（或模拟加载）的用户数据存入缓存，设置过期时间（例如 1 小时）
        await setCache(cacheKey, fullUser, 60 * 60);
        globLogger.info(`Cache miss for user ${user.id}, data cached.`);

        cb(null, fullUser);
    }
});

export default passport;
