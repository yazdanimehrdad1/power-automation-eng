import { createClient } from 'redis';

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

// Connect to Redis with retry logic
const connectWithRetry = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start connection with retry
connectWithRetry();

// Handle Redis errors
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Handle successful connection
redisClient.on('connect', () => console.log('Connected to Redis'));

export default redisClient; 