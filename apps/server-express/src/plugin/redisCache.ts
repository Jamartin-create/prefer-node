import { createClient, RedisClientType } from 'redis';
import { globLogger } from 'logger';

let client: RedisClientType | null = null;
let isReady = false;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; // 从环境变量获取 Redis 连接 URL

export async function connectRedis() {
    if (client) return;
    try {
        client = createClient({
            url: redisUrl
        });

        client.on('error', err => {
            globLogger.error('Redis Client Error', err);
            isReady = false; // 连接出错时标记为不可用
        });

        client.on('ready', () => {
            globLogger.info('Redis client is ready');
            isReady = true; // 连接成功时标记为可用
        });

        client.on('end', () => {
            globLogger.info('Redis client connection ended');
            isReady = false; // 连接断开时标记为不可用
        });

        await client.connect();
    } catch (error) {
        globLogger.error('Failed to connect to Redis', error);
        isReady = false; // 连接失败时标记为不可用
        client = null; // 连接失败时将 client 置为 null
    }
}

// 封装 Redis set 操作，处理 Redis 不可用的情况
export async function setCache(key: string, value: any, ttl: number = 60 * 60) {
    if (!isReady || !client) {
        globLogger.warn('Redis client is not ready. Set operation skipped.');
        return;
    }
    try {
        // 将 value 转换为 JSON 字符串存储
        await client.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
        globLogger.error(`Failed to set cache for key ${key}:`, error);
    }
}

// 封装 Redis get 操作，处理 Redis 不可用的情况
export async function getCache(key: string): Promise<any | null> {
    if (!isReady || !client) {
        globLogger.warn('Redis client is not ready. Get operation skipped.');
        return null; // Redis 不可用时返回 null
    }
    try {
        const data = await client.get(key);
        if (data) {
            return JSON.parse(data); // 解析 JSON 字符串
        } else {
            return null;
        }
    } catch (error) {
        globLogger.error(`Failed to get cache for key ${key}:`, error);
        return null; // 获取失败时返回 null
    }
}

// 可选：封装 Redis delete 操作
export async function deleteCache(key: string) {
    if (!isReady || !client) {
        globLogger.error(
            'Redis client is not ready. Delete operation skipped.'
        );
        return;
    }
    try {
        await client.del(key);
    } catch (error) {
        globLogger.error(`Failed to delete cache for key ${key}:`, error);
    }
}

// 导出连接状态，方便外部检查（可选）
export function isRedisReady() {
    return isReady;
}
