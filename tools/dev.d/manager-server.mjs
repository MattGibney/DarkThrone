#!/usr/bin/env node
import http from 'node:http';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const port = Number(process.env.WORKTREE_MANAGER_PORT ?? 4310);

const repoRoot = execSync('git rev-parse --show-toplevel', {
  cwd: new URL('.', import.meta.url),
  stdio: ['ignore', 'pipe', 'ignore'],
})
  .toString()
  .trim();

const fileStat = (path) => {
  try {
    return statSync(path);
  } catch {
    return undefined;
  }
};

const isFile = (path) => Boolean(fileStat(path)?.isFile());

const listGitWorktrees = () => {
  try {
    const output = execSync('git worktree list --porcelain', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    if (!output) {
      return [{ rootPath: repoRoot }];
    }

    const worktrees = [];
    let current;

    for (const line of output.split('\n')) {
      if (line.startsWith('worktree ')) {
        if (current?.rootPath) {
          worktrees.push(current);
        }
        current = { rootPath: line.slice('worktree '.length).trim() };
        continue;
      }

      if (line.startsWith('branch ') && current) {
        current.branch = line
          .slice('branch '.length)
          .trim()
          .replace(/^refs\/heads\//, '');
      }
    }

    if (current?.rootPath) {
      worktrees.push(current);
    }

    return worktrees.length > 0 ? worktrees : [{ rootPath: repoRoot }];
  } catch {
    return [{ rootPath: repoRoot }];
  }
};

const listWorktreeEnvFiles = (rootPath) => {
  const envFiles = [];
  const rootEnvPath = join(rootPath, '.env.dev');
  if (isFile(rootEnvPath)) {
    envFiles.push(rootEnvPath);
  }

  const dataRoot = join(rootPath, '.data');
  try {
    for (const entry of readdirSync(dataRoot)) {
      const envPath = join(dataRoot, entry, '.env.dev');
      if (isFile(envPath)) {
        envFiles.push(envPath);
      }
    }
  } catch {}

  return envFiles;
};

const pickEnvFile = (rootPath) => {
  const envFiles = listWorktreeEnvFiles(rootPath);
  const rootEnv = join(rootPath, '.env.dev');
  if (envFiles.includes(rootEnv)) {
    return rootEnv;
  }
  return envFiles[0];
};

const parseEnv = (path) => {
  const raw = readFileSync(path, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
};

const portListening = (value) => {
  if (!value) return false;
  try {
    execSync(`lsof -nP -iTCP:${value} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
};

const resolveComposeCmd = (() => {
  let cached;
  return () => {
    if (cached !== undefined) return cached;
    try {
      execSync('docker compose version', { stdio: 'ignore' });
      cached = 'docker compose';
    } catch {
      try {
        execSync('docker-compose version', { stdio: 'ignore' });
        cached = 'docker-compose';
      } catch {
        cached = '';
      }
    }
    return cached;
  };
})();

const dockerStatus = (env) => {
  if (!env.WORK_ID) return 'down';
  const compose = resolveComposeCmd();
  if (!compose) return 'down';

  const project =
    env.COMPOSE_PROJECT ?? `dt-${String(env.WORK_ID).toLowerCase()}`;

  try {
    const output = execSync(`${compose} -p ${project} ps --status running`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    return output ? 'up' : 'down';
  } catch {
    return 'down';
  }
};

const resolveAppsStatus = (env) => {
  const ports = [env.API_PORT, env.WEB_APP_PORT, env.WEBSITE_PORT]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (ports.length === 0) return 'down';

  const openCount = ports.filter((port) => portListening(port)).length;
  if (openCount === 0) return 'down';
  if (openCount === ports.length) return 'up';
  return 'partial';
};

const combineStatus = (servicesStatus, appsStatus) => {
  if (servicesStatus === 'up' && appsStatus === 'up') {
    return 'up';
  }
  if (servicesStatus === 'down' && appsStatus === 'down') {
    return 'down';
  }
  return 'partial';
};

const buildPostgresUrl = (env) => {
  if (!env.PG_PORT || !env.PG_DB || !env.PG_USER) {
    return undefined;
  }

  const host = env.PG_HOST ?? 'localhost';
  const user = encodeURIComponent(env.PG_USER);
  const password = env.PG_PASSWORD ? encodeURIComponent(env.PG_PASSWORD) : '';
  const auth = password ? `${user}:${password}` : user;

  return `postgresql://${auth}@${host}:${env.PG_PORT}/${env.PG_DB}`;
};

const buildWorktrees = () =>
  listGitWorktrees().map((worktree) => {
    const envFile = pickEnvFile(worktree.rootPath);
    const env = envFile ? parseEnv(envFile) : {};
    const id = env.WORK_ID ?? worktree.branch ?? basename(worktree.rootPath);
    const appsStatus = envFile ? resolveAppsStatus(env) : 'down';
    const servicesStatus = envFile ? dockerStatus(env) : 'down';

    return {
      id,
      branch: worktree.branch,
      status: combineStatus(servicesStatus, appsStatus),
      updatedAt: envFile ? fileStat(envFile)?.mtime?.toISOString() : undefined,
      urls: {
        web: env.WEB_APP_URL,
        api: env.API_URL,
        website: env.WEBSITE_URL,
      },
      database: {
        postgres: buildPostgresUrl(env),
      },
      ports: {
        api: env.API_PORT ? Number(env.API_PORT) : undefined,
        web: env.WEB_APP_PORT ? Number(env.WEB_APP_PORT) : undefined,
        website: env.WEBSITE_PORT ? Number(env.WEBSITE_PORT) : undefined,
        postgres: env.PG_PORT ? Number(env.PG_PORT) : undefined,
      },
      services: {
        docker: servicesStatus,
        apps: appsStatus,
      },
    };
  });

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/worktrees')) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ worktrees: buildWorktrees() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, () => {
  console.log(`Worktree manager API listening on http://localhost:${port}/worktrees`);
});
