/// <reference types='vitest' />
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devPort = Number(process.env.VITE_DEV_PORT ?? process.env.PORT ?? 4305);
const previewPort = Number(process.env.VITE_PREVIEW_PORT ?? 5305);
const devHost = process.env.VITE_DEV_HOST ?? process.env.HOST ?? '0.0.0.0';

const allowedHosts = [
  'localhost',
  '127.0.0.1',
  '.darkthrone.test',
  '.darkthrone.local',
]
  .concat((process.env.VITE_ALLOWED_HOSTS ?? '').split(','))
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/worktree-manager',
  server: {
    port: Number.isFinite(devPort) ? devPort : 4305,
    host: devHost,
    allowedHosts,
    proxy: {
      '/worktrees': 'http://localhost:4310',
    },
  },
  preview: {
    port: Number.isFinite(previewPort) ? previewPort : 5305,
    host: devHost,
    allowedHosts,
  },
  plugins: [react(), nxViteTsPaths()],
  build: {
    outDir: '../../dist/apps/worktree-manager',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
