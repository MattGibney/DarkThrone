import { TextDecoder, TextEncoder } from 'node:util';

Object.defineProperty(globalThis, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
});

Object.defineProperty(globalThis, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});
