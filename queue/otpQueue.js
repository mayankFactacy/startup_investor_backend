// import {Queue} from 'bullmq'
// import redisConnection from "../config/redisConnection.js";


// const otpQueue = new Queue('otpqueue',{
//     connection: redisConnection
// })


// await otpQueue.clean(1000,"completed");

// await otpQueue.clean(300000, "failed");

// await otpQueue.clean(3600000, "delayed");

// export default otpQueue