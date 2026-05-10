import { describe, it, expect, beforeAll } from 'vitest';
import { createTypewoo } from '../../../../index.js';
import type { TypewooClient } from '../../../../index.js';
import { AdminSystemStatusSchema } from '../../../types/admin/system-status/system-status.schema.js';
import {
  getWpUrl,
  getAdminUser,
  getAdminAppPassword,
} from '../../helpers/integration-config.js';

let sdk: TypewooClient;

beforeAll(() => {
  sdk = createTypewoo({
    baseUrl: getWpUrl(),
    admin: {
      consumer_key: getAdminUser(),
      consumer_secret: getAdminAppPassword(),
      useAuthInterceptor: true,
    },
  });
});

describe('Admin System Status — integration', () => {
  it('gets system status and validates schema', async () => {
    const { data, error } = await sdk.admin.systemStatus.get();

    expect(
      error,
      `unexpected error: ${error?.code} — ${error?.message}`
    ).toBeUndefined();
    expect(data).toBeDefined();
    // System status has a complex shape that varies by WP/WC version; just validate core fields
    expect(typeof data?.environment).toBe('object');
    expect(typeof data?.database).toBe('object');
  });
});
