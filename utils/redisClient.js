import Redis from "ioredis"
import redisConnection from "../config/redisConnection.js"

const redis = new Redis(redisConnection)

export default redis