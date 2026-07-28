import NodeCache from 'node-cache';
import logger from './logger';

// Default TTL is 10 minutes (600 seconds)
const localCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export const getCache = <T>(key: string): T | undefined => {
  const value = localCache.get<T>(key);
  if (value !== undefined) {
    logger.debug(`Cache Hit for key: ${key}`);
  }
  return value;
};

export const setCache = <T>(key: string, value: T, ttl?: number): boolean => {
  logger.debug(`Cache Set for key: ${key}`);
  if (ttl !== undefined) {
    return localCache.set(key, value, ttl);
  }
  return localCache.set(key, value);
};

export const deleteCache = (key: string | string[]): number => {
  logger.debug(`Cache Delete for key: ${key}`);
  return localCache.del(key);
};

export const flushCache = (): void => {
  logger.info('Flushing entire system cache');
  localCache.flushAll();
};

export default localCache;
