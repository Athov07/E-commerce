import dotenv from 'dotenv';
dotenv.config();
import { createClient } from 'redis';
import logger from '../utils/logger.js';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => logger.error('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        logger.info('Connected to Redis successfully');
    } catch (err) {
        logger.error('Could not connect to Redis. Ensure Redis is running.');
    }
})();

export const saveOTP = async (phone, otp) => {
    if (!client.isOpen) await client.connect();
    await client.setEx(`otp:${phone}`, 300, otp);
    console.log(`\n--- TERMINAL OTP FOR ${phone} ---`);
    console.log(`OTP: ${otp}`);
    console.log(`----------------------------------\n`);
};

export const verifyOTP = async (phone, otp) => {
    if (!client.isOpen) await client.connect();
    const cachedOtp = await client.get(`otp:${phone}`);
    return cachedOtp === otp;
};