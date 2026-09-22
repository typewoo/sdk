import { createTypewoo } from '@typewoo/core';

/**
 * Shared Typewoo SDK instance for the app.
 *
 * Created once at module load and imported wherever the SDK is needed.
 */
export const typewoo = createTypewoo({
  baseUrl: 'http://localhost:8080',
  request: {
    retry: {
      enabled: true,
    },
  },
});
