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
  isLoose: true,
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
