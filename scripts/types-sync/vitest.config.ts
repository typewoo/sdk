import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'types-sync',
    include: ['__tests__/**/*.spec.ts'],
    environment: 'node',
  },
});
