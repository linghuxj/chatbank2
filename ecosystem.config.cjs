module.exports = {
  apps: [
    {
      name: "chatbank2",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
      },
    },
  ],
};
