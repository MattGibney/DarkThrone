/// <reference types="vitest" />
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devPort = Number(process.env.VITE_DEV_PORT ?? process.env.PORT ?? 4201);
const previewPort = Number(process.env.VITE_PREVIEW_PORT ?? 4301);
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
  build: {
    outDir: '../../dist/apps/website',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  cacheDir: '../../node_modules/.vite/website',

  server: {
    port: Number.isFinite(devPort) ? devPort : 4201,
    host: devHost,
    allowedHosts,
    fs: {
      allow: ['..'],
    },
  },

  preview: {
    port: Number.isFinite(previewPort) ? previewPort : 4301,
    host: devHost,
    allowedHosts,
  },

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    reporters: ['default'],
    passWithNoTests: true,
    coverage: {
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      reportsDirectory: '../../coverage/apps/website',
      provider: 'v8',
    },
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
