
// import { Worker } from "bullmq";
// import redisConnection  from "../config/redisConnection.js";
// import sendEmail from "../utils/email.js";


// const otpWorker = new Worker('otpqueue',async(job)=>{
//     try {
//         const {email,otp} = job.data;
//         const subject = 'OTP Verification';
//         const html = `<p>Your OTP is <strong>${otp}</strong></p>`;
//         await sendEmail(email, subject, html);
//         console.log('otp sent');
        
//     } catch (error) {
        
//         console.log("error in sendign otp");
        
//     }
// },
// {
//     connection:redisConnection,
// })

// otpWorker.on('completed', (job) => {
    
//     console.log(`Job ${job.id} completed successfully`);
// });

// otpWorker.on('failed', (job, err) => {
//     console.log(`Job ${job.id} failed with error: ${err.message}`);
// });

// otpWorker.on('error',(err)=>{
//     console.log("worker error",err);
    
// })