import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // environment: 'happy-dom',
    browser: {
      enabled: true,
      name: 'chrome', // browser name is required
    },

  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
