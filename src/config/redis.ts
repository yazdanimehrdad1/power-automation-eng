import { createClient } from 'redis';

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Handle Redis errors
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Handle successful connection
redisClient.on('connect', () => console.log('Connected to Redis'));

export default redisClient; 