import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['components/**/*.tsx', 'lib/schemas.ts', 'lib/permissions.ts'],
      reporter: [['text', { maxCols: 120, skipFull: false }], 'html'],
    },
  },
});
