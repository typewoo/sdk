/**
 * Unit tests for diff.mjs — focused on optional-mismatch suppression
 * when the upstream field has readonly:true.
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import { diffPair } from '../diff.mjs';

/** Minimal normalised schema factory. */
function makeSchema(
  fields: Record<
    string,
    Partial<{
      type: string;
      optional: boolean;
      nullable: boolean;
      readonly: boolean;
      additionalProperties: boolean;
    }>
  >,
  additionalProperties = true
) {
  return {
    additionalProperties,
    fields: Object.fromEntries(
      Object.entries(fields).map(([name, f]) => [
        name,
        {
          type: 'string',
          optional: false,
          nullable: false,
          readonly: false,
          additionalProperties: false,
          ...f,
        },
      ])
    ),
  };
}

const BASE_ARGS = {
  surface: 'admin',
  route: '/wc/v3/coupons',
  kind: 'response',
  options: { checkDescriptions: false },
} as const;

describe('diffPair – optional-mismatch', () => {
  it('fires optional-mismatch when upstream field is non-readonly and optionals differ', () => {
    const sdk = makeSchema({ code: { type: 'string', optional: false } });
    const upstream = makeSchema({
      code: { type: 'string', optional: true, readonly: false },
    });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const mismatch = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'optional-mismatch'
    );

    expect(mismatch).toHaveLength(1);
    expect(mismatch[0].field).toBe('code');
    expect(mismatch[0].severity).toBe('warn');
  });

  it('suppresses optional-mismatch when upstream field has readonly:true', () => {
    const sdk = makeSchema({ id: { type: 'integer', optional: false } });
    const upstream = makeSchema({
      id: { type: 'integer', optional: true, readonly: true },
    });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const mismatch = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'optional-mismatch'
    );

    expect(mismatch).toHaveLength(0);
  });

  it('does not suppress when both fields agree on optional (no drift to suppress)', () => {
    const sdk = makeSchema({ id: { type: 'integer', optional: false } });
    const upstream = makeSchema({
      id: { type: 'integer', optional: false, readonly: true },
    });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const mismatch = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'optional-mismatch'
    );

    expect(mismatch).toHaveLength(0);
  });

  it('suppresses optional-mismatch for readonly fields and emits no drift when types are also compatible', () => {
    // id: readonly, optional differs (suppressed) + number vs integer (fully compatible — no drift)
    const sdk = makeSchema({ id: { type: 'number', optional: false } });
    const upstream = makeSchema({
      id: { type: 'integer', optional: true, readonly: true },
    });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    expect(drifts).toHaveLength(0);
  });
});

describe('diffPair – number/integer type compatibility', () => {
  it('emits no type-mismatch when SDK is number and upstream is integer', () => {
    const sdk = makeSchema({ id: { type: 'number' } });
    const upstream = makeSchema({ id: { type: 'integer' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const typeDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'type-mismatch'
    );
    expect(typeDrift).toHaveLength(0);
  });

  it('emits no type-mismatch when SDK is integer and upstream is number', () => {
    const sdk = makeSchema({ count: { type: 'integer' } });
    const upstream = makeSchema({ count: { type: 'number' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const typeDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'type-mismatch'
    );
    expect(typeDrift).toHaveLength(0);
  });

  it('still emits type-mismatch for genuinely incompatible types', () => {
    const sdk = makeSchema({ status: { type: 'string' } });
    const upstream = makeSchema({ status: { type: 'integer' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const typeDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'type-mismatch'
    );
    expect(typeDrift).toHaveLength(1);
    expect(typeDrift[0].severity).toBe('error');
  });
});

describe('diffPair – items-enum-drift severity', () => {
  function makeArraySchema(itemEnum: string[] | undefined) {
    return {
      additionalProperties: true,
      fields: {
        status: {
          type: 'array',
          optional: true,
          nullable: false,
          readonly: false,
          additionalProperties: false,
          items: itemEnum
            ? { type: 'string', enum: itemEnum }
            : { type: 'string' },
        },
      },
    };
  }

  it('emits items-enum-drift with error severity (own severity row, not enum-drift)', () => {
    const sdk = makeArraySchema(['completed', 'processing']);
    const upstream = makeArraySchema(['cancelled', 'completed', 'processing']);

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const itemsDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'items-enum-drift'
    );
    expect(itemsDrift).toHaveLength(1);
    // Severity must come from the items-enum-drift row in SEVERITY, not enum-drift.
    expect(itemsDrift[0].severity).toBe('error');
  });
});

describe('diffPair – default-mismatch with object defaults', () => {
  it('treats object defaults with different key ordering as equal', () => {
    // Both sides declare the same default object but with different key order.
    // JSON.stringify without sorting would report a false mismatch.
    const sdkFields = {
      meta: {
        type: 'object' as const,
        optional: true,
        nullable: false,
        readonly: false,
        additionalProperties: false,
        default: { b: 2, a: 1 },
      },
    };
    const upstreamFields = {
      meta: {
        type: 'object' as const,
        optional: true,
        nullable: false,
        readonly: false,
        additionalProperties: false,
        default: { a: 1, b: 2 },
      },
    };
    const sdk = { additionalProperties: true, fields: sdkFields };
    const upstream = { additionalProperties: true, fields: upstreamFields };

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const defaultDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'default-mismatch'
    );
    expect(defaultDrift).toHaveLength(0);
  });
});
