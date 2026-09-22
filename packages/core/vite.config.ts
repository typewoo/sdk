import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// Integration and flow suites need a running WordPress + WooCommerce store.
// They run only when asked for explicitly, either by path
// (`vitest run src/lib/tests/integration`, as CI does) or with
// TYPEWOO_LIVE_TESTS=1. A plain `vitest run` / `nx test` runs the unit,
// contract (schema drift) and snapshot suites, which need no network.
const LIVE_SUITES = ['src/lib/tests/integration/**', 'src/lib/tests/flow/**'];
const runLiveSuites =
  process.env.TYPEWOO_LIVE_TESTS === '1' ||
  process.argv.some((arg) => /tests[\\/](integration|flow)\b/.test(arg));

export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    resolve: {
      preserveSymlinks: true,
    },
    cacheDir: '../../node_modules/.vite/packages/core',
    plugins: [],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    test: {
      watch: false,
      globals: true,
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: runLiveSuites
        ? configDefaults.exclude
        : [...configDefaults.exclude, ...LIVE_SUITES],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
        // Enforced on the default (unit, contract, snapshot) suite in CI.
        thresholds: {
          statements: 90,
          branches: 80,
          functions: 92,
          lines: 90,
        },
        exclude: [
          // Pure type/interface definition folders (tree-shaken, no runtime)
          'src/lib/types/**',
          // Event map & plugin interface only contain types
          'src/lib/sdk.events.ts',
          // Config types-only files
          'src/lib/configs/sdk.config.ts',
          // Test suites and test helpers are not production code
          'src/lib/tests/**',
          // Generated / build output & configs
          '**/dist/**',
          '**/eslint.config.*',
          'vite.config.ts',
          '**/test-output/**',
        ],
      },
    },
  };
});
