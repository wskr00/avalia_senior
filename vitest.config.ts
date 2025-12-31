import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/main/webapp', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/main/webapp/test-setup.ts'],
    include: ['src/main/webapp/**/*.spec.ts'],
    pool: 'threads',
    isolate: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
