import { Redis } from '@upstash/redis';



let redis: Redis | null = null;

export function useRedis() {
  const config = useRuntimeConfig();
  if (!redis) {
    redis = new Redis({
      url: config.upstashRedisRestUrl,
      token: config.upstashRedisRestToken,
    });
  }

  return redis;
}