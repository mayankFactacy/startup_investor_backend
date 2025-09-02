const redisConnection = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT,10) || 6379
}

export default redisConnection;