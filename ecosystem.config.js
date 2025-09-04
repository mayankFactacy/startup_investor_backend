module.exports = {
  apps: [
    {
      name: "factacy-backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: "queue-worker",
      script: "otpQueueWorker.js",   
      cwd: "./worker",               
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
