const fs = require('fs');

const rawEnvFile = fs.readFileSync('/home/matt/Code/DTR/.env', 'utf8');
const envRegex = /^\s*export\s+([^=]+?)=(.*)\s*$/gm;
const envVariables = {};

let match;
while ((match = envRegex.exec(rawEnvFile)) !== null) {
  const key = match[1].trim();
  const value = match[2].trim().replace(/(^['"]|['"]$)/g, ''); // Remove surrounding quotes if present
  envVariables[key] = value;
}

module.exports = {
  apps : [{
    name: "darkthrone_prod",
    script: "./main.js",
    cwd: "/home/matt/Code/DTR/current/api",
    error_file: "/home/matt/Code/DTR/logs/app.err.log",
    out_file: "../../logs/app.out.log",
    exec_mode: "fork_mode",
    env: envVariables,
  }]
}
