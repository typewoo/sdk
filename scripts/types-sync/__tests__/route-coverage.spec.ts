/**
 * Route-coverage tests. The complement to registry.spec.ts: that file enforces
 * SDK→upstream mapping, this one enforces upstream→SDK coverage.
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import {
  loadRouteAllowlist,
  computeRouteCoverage,
} from '../route-coverage.mjs';

let tmp: string;
let allowlistPath: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'route-coverage-'));
  allowlistPath = join(tmp, 'route-allowlist.json');
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

function writeAllowlist(content: unknown) {
  writeFileSync(allowlistPath, JSON.stringify(content), 'utf8');
}

describe('loadRouteAllowlist', () => {
  it('returns an empty set when the file is missing', () => {
    const set = loadRouteAllowlist(join(tmp, 'does-not-exist.json'));
    expect(set.size).toBe(0);
  });

  it('loads valid entries into a surface|route key set', () => {
    writeAllowlist({
      entries: [
        {
          surface: 'admin',
          route: '/wc/v3/system_status',
          reason: 'Diagnostics surface',
          addedAt: '2026-05-02',
        },
        {
          surface: 'store',
          route: '/wc/store/v1/cart',
          reason: 'Pending registry population',
          addedAt: '2026-05-02',
        },
      ],
    });
    const set = loadRouteAllowlist(allowlistPath);
    expect(set.has('admin|/wc/v3/system_status')).toBe(true);
    expect(set.has('store|/wc/store/v1/cart')).toBe(true);
    expect(set.size).toBe(2);
  });

  it('throws when an entry is missing its reason', () => {
    writeAllowlist({
      entries: [
        {
          surface: 'admin',
          route: '/wc/v3/foo',
          reason: '',
          addedAt: '2026-05-02',
        },
      ],
    });
    expect(() => loadRouteAllowlist(allowlistPath)).toThrow(/reason/);
  });

  it('throws when an entry is missing addedAt', () => {
    writeAllowlist({
      entries: [
        {
          surface: 'admin',
          route: '/wc/v3/foo',
          reason: 'because',
        },
      ],
    });
    expect(() => loadRouteAllowlist(allowlistPath)).toThrow(/addedAt/);
  });

  it('throws when entries is not an array', () => {
    writeAllowlist({ entries: 'not-an-array' });
    expect(() => loadRouteAllowlist(allowlistPath)).toThrow(/array/);
  });
});

describe('computeRouteCoverage', () => {
  const snapshot = {
    surfaces: {
      admin: {
        '/wc/v3/coupons': {},
        '/wc/v3/system_status': {},
        '/wc/v3/orders': {},
      },
      store: {
        '/wc/store/v1/cart': {},
      },
    },
  };

  it('flags every unmapped, non-allowlisted route as error', () => {
    const registry = [
      { surface: 'admin', route: '/wc/v3/coupons' },
      { surface: 'admin', route: '/wc/v3/orders' },
    ];
    const drifts = computeRouteCoverage(snapshot, registry, new Set());

    expect(drifts).toHaveLength(2);
    const keys = drifts.map((d) => `${d.surface}|${d.route}`).sort();
    expect(keys).toEqual([
      'admin|/wc/v3/system_status',
      'store|/wc/store/v1/cart',
    ]);
    for (const d of drifts) {
      expect(d.severity).toBe('error');
      expect(d.driftKind).toBe('route-missing-sdk');
      expect(d.kind).toBe('coverage');
      expect(d.field).toBe('<route>');
    }
  });

  it('skips routes that are allowlisted', () => {
    const registry = [
      { surface: 'admin', route: '/wc/v3/coupons' },
      { surface: 'admin', route: '/wc/v3/orders' },
    ];
    const allowlist = new Set([
      'admin|/wc/v3/system_status',
      'store|/wc/store/v1/cart',
    ]);
    const drifts = computeRouteCoverage(snapshot, registry, allowlist);
    expect(drifts).toHaveLength(0);
  });

  it('returns no drifts when every route is mapped', () => {
    const registry = [
      { surface: 'admin', route: '/wc/v3/coupons' },
      { surface: 'admin', route: '/wc/v3/orders' },
      { surface: 'admin', route: '/wc/v3/system_status' },
      { surface: 'store', route: '/wc/store/v1/cart' },
    ];
    const drifts = computeRouteCoverage(snapshot, registry, new Set());
    expect(drifts).toHaveLength(0);
  });

  it('handles a snapshot with no surfaces gracefully', () => {
    const drifts = computeRouteCoverage({}, [], new Set());
    expect(drifts).toEqual([]);
  });
});
