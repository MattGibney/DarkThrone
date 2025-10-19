
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';
import i18next from 'eslint-plugin-i18next';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: { i18next },
    ...i18next.configs['flat/recommended'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'plugin:@nx/typescript',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
        quotes: [2, 'single'],
        curly: ['error', 'multi-line'],
        'prettier/prettier': 'error',
        'no-extra-semi': 'off',
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
        'no-extra-semi': 'off',
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'plugin:@nx/typescript',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
    })
    .map((config) => ({
      ...config,
      files: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/*.ts',
        '**/*.tsx',
        '**/*.cts',
        '**/*.mts',
      ],
      rules: {
        ...config.rules,
        quotes: [2, 'single'],
        curly: ['error', 'multi-line'],
        'prettier/prettier': 'error',
        'no-extra-semi': 'off',
      },
    })),
];
