/**
 * PM2 process for Bonotech mail API on the DEKKO-RPA-AUTO droplet.
 * Public path (via Caddy): https://rpa.dekkoai.online/bonotech-api/*
 */
const apiRoot = __dirname;
const home = process.env.HOME || "/root";

function nvmBash(inner) {
  return `export NVM_DIR="${home}/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && cd "${apiRoot}" && ${inner}`;
}

module.exports = {
  apps: [
    {
      name: "bonotech-mail-api",
      script: "bash",
      args: ["-lc", nvmBash("exec npm start")],
      cwd: apiRoot,
      autorestart: true,
      max_restarts: 20,
      min_uptime: "10s",
      exp_backoff_restart_delay: 200,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
