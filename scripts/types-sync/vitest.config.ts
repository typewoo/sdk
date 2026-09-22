import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolve `include` relative to this folder, so the config works from the
  // repo root too (`vitest run --config scripts/types-sync/vitest.config.ts`).
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    name: 'types-sync',
    include: ['__tests__/**/*.spec.ts'],
    environment: 'node',
  },
});
