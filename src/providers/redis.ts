import * as initializer from "redis";
import { promisify } from "util";

const redis = initializer.createClient({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export default redis;
export const getAsync = promisify(redis.get).bind(redis);
export const getLrange = promisify(redis.lrange).bind(redis);
