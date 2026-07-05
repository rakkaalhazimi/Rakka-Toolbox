import { nanoid } from "nanoid";

import { useRedis } from "~~/server/utils/redis"



const retries = 3;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  if (query.url) {
    const code = nanoid(7);
    const redis = useRedis();
    
    for (let i = 0; i < retries; i++) {
      const exists = await redis.get(code);
      if (!exists) {
        await redis.set(code, query.url);
        const origin = getRequestURL(event).origin;
        // Result <baseUrl>/<code>
        // example: localhost:3000/1234
        const url = new URL(code, origin);
        return { url };
      }
    }
  }
  return { url: null };
})