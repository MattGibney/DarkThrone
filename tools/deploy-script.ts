import { exec } from 'child_process';

var colors = require('colors/safe');

async function prepareScript() {
  console.log('Preparing the script \n');

  await runCmdAndLog('Installing the dependencies', 'npm install');
  await runCmdAndLog('Reset Cache', 'npx nx reset');
}

async function buildScript() {
  console.log('Building the script \n');

  await runCmdAndLog('Building the Placeholder Site', 'npx nx run placeholder-site:build:production');
  await runCmdAndLog('Building the Web App', 'npx nx run web-app:build:production');
  await runCmdAndLog('Building the API', 'npx nx run api:build:production');
}

async function deployScript() {
  console.log('Deploying the script \n');
}

(async () => {
  console.clear();
  console.log(colors.green('DarkThrone Reborn - Deploy Script'));
  console.log(Array(40).join('-'));

  await prepareScript();
  await buildScript();
  await deployScript();
})();

async function runCmdAndLog(description: string, cmd: string) {
  process.stdout.write(`${description}... `);
  try {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
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
