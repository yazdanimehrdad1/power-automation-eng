import { RedisUtils } from './redis.utils';

export interface CacheOptions {
  ttl?: number;        // Time to live in seconds
  key?: string;        // Custom cache key
  keyPrefix?: string;  // Prefix for generated keys
}

type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

/**
 * Cache decorator for methods
 * @param options Cache options
 */
export function Cache(options: CacheOptions = {}): MethodDecorator {
  return function <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value as Function;

    descriptor.value = async function (...args: any[]) {
      // Generate cache key
      const cacheKey = options.key || 
        `${options.keyPrefix || ''}:${String(propertyKey)}:${JSON.stringify(args)}`;

      // Try to get from cache
      const cachedValue = await RedisUtils.get(cacheKey);
      if (cachedValue) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return cachedValue;
      }

      // If not in cache, execute method
      const result = await originalMethod.apply(this, args);

      // Store in cache
      if (result !== null && result !== undefined) {
        await RedisUtils.set(cacheKey, result, options.ttl || 3600); // Default 1 hour TTL
        console.log(`Cached result for key: ${cacheKey}`);
      }

      return result;
    } as unknown as T;

    return descriptor;
  };
} 