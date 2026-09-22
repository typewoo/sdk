import { describe, it, expect } from 'vitest';
import { makeTestDeps } from '../../helpers/make-test-deps.js';
import { BaseService } from '../../../services/base.service.js';
import { StoreService } from '../../../services/store.service.js';
import { AdminService } from '../../../services/admin.service.js';
import { AnalyticsService } from '../../../services/analytics.service.js';

/** Names of all getters declared directly on a class. */
function getterNames(cls: { prototype: object }): string[] {
  return Object.entries(Object.getOwnPropertyDescriptors(cls.prototype))
    .filter(([, d]) => typeof d.get === 'function')
    .map(([name]) => name);
}

describe.each([
  ['StoreService', StoreService],
  ['AdminService', AdminService],
  ['AnalyticsService', AnalyticsService],
])('%s accessors', (_name, Service) => {
  const names = getterNames(Service);

  it('exposes at least one sub-service', () => {
    expect(names.length).toBeGreaterThan(0);
  });

  it.each(names)(
    '%s is created lazily, cached, and shares the parent deps',
    (name) => {
      const { state, config, events, http } = makeTestDeps();
      const parent = new Service(state, config, events, http);

      const first = (parent as unknown as Record<string, unknown>)[name];
      const second = (parent as unknown as Record<string, unknown>)[name];

      expect(first).toBeInstanceOf(BaseService);
      expect(second).toBe(first);
      // Sub-services must use the same instance-bound state, config and http.
      const sub = first as unknown as Record<string, unknown>;
      expect(sub['state']).toBe(state);
      expect(sub['config']).toBe(config);
      expect(sub['events']).toBe(events);
      expect(sub['http']).toBe(http);
    }
  );
});
