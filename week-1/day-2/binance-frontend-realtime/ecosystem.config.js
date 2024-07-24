module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005',
      exec_mode: 'cluster', // Optional: run in cluster mode if you have multiple CPUs
      instances: 1, // Adjust based on available resources
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
