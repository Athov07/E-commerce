import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Connected to Redis successfully'));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Could not establish a connection with Redis. ' + error);
        setTimeout(connectRedis, 5000);
    }
};

connectRedis();

export default redisClient;