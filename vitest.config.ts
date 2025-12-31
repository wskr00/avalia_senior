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
    globals: true, // Permite usar describe/it/expect sem import explícito
    environment: 'jsdom',
    setupFiles: ['src/main/webapp/test-setup.ts'],
    include: ['src/main/webapp/**/*.spec.ts'],
    // Configurações de execução
    pool: 'threads',
    isolate: true,
    css: false, // O Vitest não processará o SCSS/CSS como arquivos reais, apenas o Angular fará isso
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
