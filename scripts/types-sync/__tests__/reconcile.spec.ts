/**
 * Unit tests for reconcile.mjs.
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import { reconcileAcrossVersions } from '../reconcile.mjs';

function makeDrift(
  overrides: Partial<{
    kind: string;
    field: string;
    driftKind: string;
    severity: string;
    route: string;
    surface: string;
  }> = {}
) {
  return {
    surface: 'admin',
    route: '/wc/v3/coupons',
    kind: 'response',
    field: 'billing.city',
    driftKind: 'extra-in-sdk',
    severity: 'error',
    sdk: { type: 'string' },
    upstream: null,
    ...overrides,
  };
}

// ─── single-version path ──────────────────────────────────────────────────────

describe('reconcileAcrossVersions – single-version window', () => {
  it('returns latest drifts unchanged when window has one version', () => {
    const d = makeDrift();
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([['10.7.0', [d]]]),
      window: { versions: ['10.7.0'], latest: '10.7.0' },
    });
    expect(result).toHaveLength(1);
    expect(result[0].driftKind).toBe('extra-in-sdk');
    expect(result[0].severity).toBe('error');
  });

  it('honours deprecation acks in single-version mode', () => {
    const d = makeDrift({ field: 'old_field' });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([['10.7.0', [d]]]),
      window: { versions: ['10.7.0'], latest: '10.7.0' },
      registryEntry: {
        deprecated: {
          fields: ['old_field'],
          sinceVersion: '9.0.0',
          note: 'removed',
        },
      },
    });
    expect(result[0].severity).toBe('info');
    expect(result[0].provenance.acked).toBe(true);
    expect(result[0].provenance.deprecatedSince).toBe('9.0.0');
  });
});

// ─── extra-in-sdk: back-compat cover ─────────────────────────────────────────

describe('reconcileAcrossVersions – extra-in-sdk cross-version', () => {
  it('downgrades to removed-in-window when field is still in an older version', () => {
    // Latest: extra-in-sdk. Older version: no drift for this field (field exists there).
    const latest = makeDrift({ driftKind: 'extra-in-sdk', severity: 'error' });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [latest]],
        ['9.5.0', []], // field exists in 9.5.0 → no drift
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].driftKind).toBe('removed-in-window');
    expect(result[0].severity).toBe('info');
    expect(result[0].provenance.lastSeenIn).toBe('9.5.0');
    expect(result[0].provenance.stillSupportedIn).toContain('9.5.0');
  });

  it('stays error with safeToRemove when field is extra in ALL versions', () => {
    const latest = makeDrift({ driftKind: 'extra-in-sdk', severity: 'error' });
    const older = makeDrift({ driftKind: 'extra-in-sdk', severity: 'error' });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [latest]],
        ['9.5.0', [older]],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].driftKind).toBe('extra-in-sdk');
    expect(result[0].severity).toBe('error');
    expect(result[0].provenance.safeToRemove).toBe(true);
  });

  // ── Bug 1 regression ──────────────────────────────────────────────────────
  it('does NOT downgrade to removed-in-window when older version had route-missing-upstream', () => {
    // Latest reports extra-in-sdk for field 'billing.city'.
    // Older version reports route-missing-upstream for the same route/kind.
    // The older version never had the route, so the field is NOT back-compat cover.
    const latest = makeDrift({
      kind: 'response',
      field: 'billing.city',
      driftKind: 'extra-in-sdk',
      severity: 'error',
    });
    const olderRouteMissing = {
      surface: 'admin',
      route: '/wc/v3/coupons',
      kind: 'response',
      field: '<route>',
      driftKind: 'route-missing-upstream',
      severity: 'error',
      sdk: null,
      upstream: null,
    };
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [latest]],
        ['9.5.0', [olderRouteMissing]],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    // Must remain extra-in-sdk error, NOT removed-in-window
    const fieldDrift = result.find(
      (d: { field: string }) => d.field === 'billing.city'
    );
    expect(fieldDrift?.driftKind).toBe('extra-in-sdk');
    expect(fieldDrift?.severity).toBe('error');
    expect(fieldDrift?.provenance?.safeToRemove).toBe(true);
  });

  it('picks the latest semver from stillSupportedIn list', () => {
    const latest = makeDrift({ driftKind: 'extra-in-sdk', severity: 'error' });
    // Both older versions have no drift → field exists there
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [latest]],
        ['9.5.0', []],
        ['9.0.1', []],
      ]),
      window: { versions: ['9.0.1', '9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].driftKind).toBe('removed-in-window');
    // lastSeenIn should be the latest of the two older versions where field exists
    expect(result[0].provenance.lastSeenIn).toBe('9.5.0');
  });
});

// ─── missing-in-sdk: addedIn provenance ──────────────────────────────────────

describe('reconcileAcrossVersions – missing-in-sdk provenance', () => {
  it('annotates addedIn with oldest version that also reports missing-in-sdk', () => {
    // Field is missing in latest AND in the older version → SDK never had it.
    // presentSince collects older versions that also reported missing-in-sdk
    // (i.e. WC had the field there too). addedIn = oldest such version.
    const missingLatest = makeDrift({
      driftKind: 'missing-in-sdk',
      severity: 'error',
    });
    const missingOlder = makeDrift({
      driftKind: 'missing-in-sdk',
      severity: 'error',
    });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [missingLatest]],
        ['9.5.0', [missingOlder]],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    // 9.5.0 also has missing-in-sdk → WC had the field in 9.5.0. addedIn = '9.5.0' (oldest).
    expect(result[0].driftKind).toBe('missing-in-sdk');
    expect(result[0].provenance.addedIn).toBe('9.5.0');
  });

  it('annotates addedIn with latest when no older version had the field missing', () => {
    // Field missing in latest only. 9.5.0 has no missing-in-sdk for this field
    // → SDK had it in 9.5.0 (or it wasn't there). presentSince = [] → addedIn = latest.
    const missingLatest = makeDrift({
      driftKind: 'missing-in-sdk',
      severity: 'error',
    });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [missingLatest]],
        ['9.5.0', []],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    // 9.5.0 has no missing-in-sdk drift → field not present in WC 9.5.0 either.
    // addedIn defaults to latest (10.7.0 is when WC introduced it).
    expect(result[0].driftKind).toBe('missing-in-sdk');
    expect(result[0].provenance.addedIn).toBe('10.7.0');
  });
});

// ─── type-mismatch / enum-drift: stale SDK downgrade ─────────────────────────

describe('reconcileAcrossVersions – type-mismatch / enum-drift stale downgrade', () => {
  it('downgrades type-mismatch to warn with matchedIn when SDK matches an older version', () => {
    const typeMismatch = makeDrift({
      driftKind: 'type-mismatch',
      severity: 'error',
    });
    // Older version: no drift for this field → SDK type matches older WC
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [typeMismatch]],
        ['9.5.0', []],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].severity).toBe('warn');
    expect(result[0].provenance.matchedIn).toBe('9.5.0');
  });

  it('keeps type-mismatch error when SDK does not match any older version', () => {
    const typeMismatch = makeDrift({
      driftKind: 'type-mismatch',
      severity: 'error',
    });
    const olderTypeMismatch = makeDrift({
      driftKind: 'type-mismatch',
      severity: 'error',
    });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [typeMismatch]],
        ['9.5.0', [olderTypeMismatch]],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].severity).toBe('error');
    expect(result[0].provenance?.matchedIn).toBeUndefined();
  });

  it('downgrades enum-drift to warn with matchedIn when SDK matches an older version', () => {
    const enumDrift = makeDrift({ driftKind: 'enum-drift', severity: 'error' });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([
        ['10.7.0', [enumDrift]],
        ['9.5.0', []],
      ]),
      window: { versions: ['9.5.0', '10.7.0'], latest: '10.7.0' },
    });
    expect(result[0].severity).toBe('warn');
    expect(result[0].provenance.matchedIn).toBe('9.5.0');
  });
});

// ─── deprecation acks ────────────────────────────────────────────────────────

describe('reconcileAcrossVersions – deprecation acks', () => {
  it('downgrades any drift on a deprecated field to info with acked:true', () => {
    const d = makeDrift({
      field: 'legacy_id',
      driftKind: 'extra-in-sdk',
      severity: 'error',
    });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([['10.7.0', [d]]]),
      window: { versions: ['10.7.0'], latest: '10.7.0' },
      registryEntry: {
        deprecated: {
          fields: ['legacy_id'],
          sinceVersion: '8.0.0',
          note: 'use id',
        },
      },
    });
    expect(result[0].severity).toBe('info');
    expect(result[0].provenance.acked).toBe(true);
    expect(result[0].provenance.deprecatedSince).toBe('8.0.0');
    expect(result[0].provenance.deprecationNote).toBe('use id');
  });

  it('does not affect undeprecated fields when registry has deprecated list', () => {
    const d = makeDrift({
      field: 'code',
      driftKind: 'type-mismatch',
      severity: 'error',
    });
    const result = reconcileAcrossVersions({
      perVersionDrifts: new Map([['10.7.0', [d]]]),
      window: { versions: ['10.7.0'], latest: '10.7.0' },
      registryEntry: { deprecated: { fields: ['legacy_id'] } },
    });
    expect(result[0].severity).toBe('error');
    expect(result[0].provenance?.acked).toBeUndefined();
  });
});
