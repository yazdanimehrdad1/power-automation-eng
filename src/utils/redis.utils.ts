import { redisClient } from '../config/redis';

export class RedisUtils {
  // Set a value with optional expiration (in seconds)
  static async set(key: string, value: any, expireInSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expireInSeconds) {
        await redisClient.setEx(key, expireInSeconds, stringValue);
      } else {
        await redisClient.set(key, stringValue);
      }
    } catch (error) {
      console.error('Redis SET Error:', error);
      throw error;
    }
  }

  // Get a value
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET Error:', error);
      throw error;
    }
  }

  // Delete a key
  static async delete(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis DELETE Error:', error);
      throw error;
    }
  }

  // Check if a key exists
  static async exists(key: string): Promise<boolean> {
    try {
      return await redisClient.exists(key) === 1;
    } catch (error) {
      console.error('Redis EXISTS Error:', error);
      throw error;
    }
  }

  // Set multiple values
  static async mset(keyValues: { [key: string]: any }): Promise<void> {
    try {
      const stringifiedValues = Object.entries(keyValues).reduce((acc, [key, value]) => {
        acc[key] = JSON.stringify(value);
        return acc;
      }, {} as { [key: string]: string });
      
      await redisClient.mSet(stringifiedValues);
    } catch (error) {
      console.error('Redis MSET Error:', error);
      throw error;
    }
  }

  // Get multiple values
  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await redisClient.mGet(keys);
      return values.map(value => value ? JSON.parse(value) : null);
    } catch (error) {
      console.error('Redis MGET Error:', error);
      throw error;
    }
  }
} 