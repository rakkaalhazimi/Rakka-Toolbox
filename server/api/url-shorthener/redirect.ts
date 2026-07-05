import { useRedis } from "~~/server/utils/redis"



export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  if (query.code) {
    const redis = useRedis();
    const url = await redis.get(query.code as string);
    return { url };
  }
  
  return { url: null };
})