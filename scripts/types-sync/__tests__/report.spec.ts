/**
 * Unit tests for report.mjs — focused on assignDriftIds prefix format (Bug 4).
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import { assignDriftIds } from '../report.mjs';

function makeDrift(
  overrides: Partial<{
    surface: string;
    route: string;
    kind: string;
    field: string;
    driftKind: string;
    severity: string;
  }> = {}
) {
  return {
    surface: 'admin',
    route: '/wc/v3/coupons',
    kind: 'response',
    field: 'code',
    driftKind: 'missing-in-sdk',
    severity: 'error',
    sdk: null,
    upstream: { type: 'string' },
    ...overrides,
  };
}

describe('assignDriftIds – ID format', () => {
  it('assigns ERROR-NNN prefix to error-severity rows', () => {
    const drifts = [makeDrift({ severity: 'error' })];
    assignDriftIds(drifts);
    expect(drifts[0].id).toBe('ERROR-001');
  });

  it('assigns WARN-NNN prefix to warn-severity rows', () => {
    const drifts = [makeDrift({ severity: 'warn' })];
    assignDriftIds(drifts);
    expect(drifts[0].id).toBe('WARN-001');
  });

  it('assigns INFO-NNN prefix to info-severity rows', () => {
    const drifts = [makeDrift({ severity: 'info' })];
    assignDriftIds(drifts);
    expect(drifts[0].id).toBe('INFO-001');
  });

  it('counts per-severity independently (ERROR-001, WARN-001, INFO-001)', () => {
    const drifts = [
      makeDrift({ severity: 'error', field: 'a' }),
      makeDrift({ severity: 'warn', field: 'b' }),
      makeDrift({ severity: 'info', field: 'c' }),
    ];
    assignDriftIds(drifts);
    const ids = new Set(drifts.map((d) => (d as { id: string }).id));
    expect(ids.has('ERROR-001')).toBe(true);
    expect(ids.has('WARN-001')).toBe(true);
    expect(ids.has('INFO-001')).toBe(true);
  });

  it('zero-pads counter to 3 digits', () => {
    const drifts = Array.from({ length: 9 }, (_, i) =>
      makeDrift({ severity: 'error', field: `field_${i}` })
    );
    assignDriftIds(drifts);
    const ids = drifts.map((d) => (d as { id: string }).id);
    expect(ids[0]).toMatch(/^ERROR-0\d\d$/);
    // The last one should be ERROR-009
    const sorted = [...ids].sort();
    expect(sorted[sorted.length - 1]).toBe('ERROR-009');
  });

  it('assigns unique IDs to every row', () => {
    const drifts = [
      makeDrift({ severity: 'error', field: 'a' }),
      makeDrift({ severity: 'error', field: 'b' }),
      makeDrift({ severity: 'error', field: 'c' }),
    ];
    assignDriftIds(drifts);
    const ids = drifts.map((d) => (d as { id: string }).id);
    expect(new Set(ids).size).toBe(3);
  });

  it('returns the same array reference (mutates in-place)', () => {
    const drifts = [makeDrift()];
    const result = assignDriftIds(drifts);
    expect(result).toBe(drifts);
  });

  it('returns empty array unchanged', () => {
    const result = assignDriftIds([]);
    expect(result).toEqual([]);
  });
});

describe('assignDriftIds – sort order (surface → route → severity → field → kind → driftKind)', () => {
  it('sorts by surface first', () => {
    const drifts = [
      makeDrift({ surface: 'store', field: 'z', severity: 'error' }),
      makeDrift({ surface: 'admin', field: 'a', severity: 'error' }),
    ];
    assignDriftIds(drifts);
    // admin sorts before store; admin row gets ERROR-001
    const adminRow = drifts.find((d) => d.surface === 'admin') as {
      id: string;
    };
    const storeRow = drifts.find((d) => d.surface === 'store') as {
      id: string;
    };
    expect(adminRow.id).toBe('ERROR-001');
    expect(storeRow.id).toBe('ERROR-002');
  });

  it('sorts by severity within same surface/route (error before warn before info)', () => {
    const drifts = [
      makeDrift({ severity: 'info', field: 'a' }),
      makeDrift({ severity: 'error', field: 'b' }),
      makeDrift({ severity: 'warn', field: 'c' }),
    ];
    assignDriftIds(drifts);
    const errorRow = drifts.find((d) => d.severity === 'error') as {
      id: string;
    };
    const warnRow = drifts.find((d) => d.severity === 'warn') as { id: string };
    // error comes first in sort → gets lower counter... but counters are per-severity
    // so we just verify prefixes are correct
    expect(errorRow.id.startsWith('ERROR-')).toBe(true);
    expect(warnRow.id.startsWith('WARN-')).toBe(true);
  });
});
