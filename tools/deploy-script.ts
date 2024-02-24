import { ExecException, ExecOptions, exec } from 'child_process';
import SSH, { ExecOptions as SSHExecOptions } from 'simple-ssh';
import { ulid } from 'ulid';

var colors = require('colors/safe');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_USER = process.env.SERVER_USER;
const SERVER_PASS = process.env.SERVER_PASS;

async function prepareScript() {
  console.log('Preparing the script \n');

  // await runCmdAndLog(exec, 'Installing the dependencies', 'npm install');
  await runCmdAndLog(exec, 'Reset Cache', 'npx nx reset');
}

async function buildScript(id: string) {
  console.log('Building the script \n');

  if (!SERVER_HOST || !SERVER_USER || !SERVER_PASS) {
    process.exit(1);
  }

  await runCmdAndLog(exec, 'Building the Placeholder Site', 'npx nx run placeholder-site:build:production');
  await runCmdAndLog(exec, 'Building the Web App', 'npx nx run web-app:build:production');
  await runCmdAndLog(exec, 'Building the API', 'npx nx run api:build:production');

  await runCmdAndLog(exec, 'Archive files', `cd dist/apps/ && tar -czvf ${id}.tar.gz placeholder-site web-app api && mv ${id}.tar.gz ../ && cd ../../`);
}

async function deployScript(id: string) {
  console.log('Deploying the script \n');

  const ssh = new SSH({
    host: SERVER_HOST || '',
    user: SERVER_USER || '',
    pass: SERVER_PASS || '',
    agent: process.env.SSH_AUTH_SOCK,
    agentForward: true
  });

  await runCmdAndLog(exec, 'Transfer the file', `scp dist/${id}.tar.gz matt@192.168.0.44:/home/matt/Code/DTR/builds`);

  runSSHCmdAndLog(ssh.exec.bind(ssh), 'Unpack the file', `cd /home/matt/Code/DTR/builds && mkdir ${id} && tar -xvf ${id}.tar.gz --directory ${id} && rm ${id}.tar.gz`);
  runSSHCmdAndLog(ssh.exec.bind(ssh), 'Install Deps', `cd /home/matt/Code/DTR/builds/${id}/api && npm install --omit=dev`);
  // Run Migrations
  runSSHCmdAndLog(ssh.exec.bind(ssh), 'Run Migrations', `source /home/matt/Code/DTR/.env && cd /home/matt/Code/DTR/builds/${id}/api && npx knex migrate:latest --knexfile knexfile.js`);
  runSSHCmdAndLog(ssh.exec.bind(ssh), 'Update Symlink', `rm /home/matt/Code/DTR/current && ln -s /home/matt/Code/DTR/builds/${id} /home/matt/Code/DTR/current`);
  runSSHCmdAndLog(ssh.exec.bind(ssh), 'Restart PM2', `cd /home/matt/Code/DTR/current/api && pm2 startOrRestart ecosystem.config.js --env production`);

  await ssh.start();
}

(async () => {
  console.clear();
  console.log(colors.green('DarkThrone Reborn - Deploy Script'));
  console.log(Array(40).join('-'));

  const id = ulid();

  await prepareScript();
  await buildScript(id);
  await deployScript(id);
})();

interface Executor {
  (command: string, options: ExecOptions, callback?: (error: ExecException | null, stdout: string, stderr: string) => void): void;
}

async function runCmdAndLog(executor: Executor, description: string, cmd: string) {
  process.stdout.write(`${description}... `);
  try {
    return new Promise((resolve, reject) => {
      executor(cmd, { maxBuffer: 1024 * 6000 }, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        // console.log(stdout);
        process.stdout.write(colors.green('Done\n'));
        resolve(stdout);
      });
    });
  } catch (error) {
    process.stdout.write(colors.red('Failed\n'));
    throw error;
  }
}

interface SSHExecutor {
  (command: string, options: SSHExecOptions): void;
}

async function runSSHCmdAndLog(executor: SSHExecutor, description: string, cmd: string) {
  try {
    return new Promise((resolve, reject) => {
      executor(cmd, {
        out: (stdout) => null,
        exit: (code, stdout, stderr) => {
          if (code !== 0) {
            console.error(stderr);
            return reject(stderr);
          }
          console.log(`${description}... ${colors.green('Done')}`);
          resolve(stdout);
        }
      });
    });
  } catch (error) {
    console.log(`${description}... ${colors.red('Failed')}`);
    throw error;
  }
}
