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

// ─── missing-in-sdk ───────────────────────────────────────────────────────────

describe('diffPair – missing-in-sdk', () => {
  it('emits missing-in-sdk when upstream has a field the SDK does not', () => {
    const sdk = makeSchema({});
    const upstream = makeSchema({ id: { type: 'integer' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    expect(drifts).toHaveLength(1);
    expect(drifts[0].driftKind).toBe('missing-in-sdk');
    expect(drifts[0].field).toBe('id');
  });

  it('emits error severity for missing response field', () => {
    const sdk = makeSchema({});
    const upstream = makeSchema({ id: { type: 'integer' } });
    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    expect(drifts[0].severity).toBe('error');
  });

  it('emits warn severity for missing query field', () => {
    const sdk = makeSchema({});
    const upstream = makeSchema({ per_page: { type: 'integer' } });
    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream, kind: 'query' });
    expect(drifts[0].severity).toBe('warn');
  });
});

// ─── extra-in-sdk ─────────────────────────────────────────────────────────────

describe('diffPair – extra-in-sdk', () => {
  it('emits extra-in-sdk when SDK has a field upstream does not', () => {
    const sdk = makeSchema({ ghost_field: { type: 'string' } });
    const upstream = makeSchema({});

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    expect(drifts).toHaveLength(1);
    expect(drifts[0].driftKind).toBe('extra-in-sdk');
    expect(drifts[0].field).toBe('ghost_field');
    expect(drifts[0].severity).toBe('error');
  });

  it('excludes _links.* paths from SDK side (WP REST envelope noise)', () => {
    const sdk = makeSchema({
      id: { type: 'integer' },
      _links: { type: 'object' },
      '_links.self': { type: 'array' },
    });
    const upstream = makeSchema({ id: { type: 'integer' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    // _links and _links.self must be silently excluded
    const extra = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'extra-in-sdk'
    );
    expect(extra).toHaveLength(0);
  });
});

// ─── enum-drift ───────────────────────────────────────────────────────────────

describe('diffPair – enum-drift', () => {
  it('emits enum-drift when enums differ', () => {
    const sdk = makeSchema({
      status: { type: 'string', enum: ['active'] },
    } as any);
    const upstream = makeSchema({
      status: { type: 'string', enum: ['active', 'inactive'] },
    } as any);

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const enumDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'enum-drift'
    );
    expect(enumDrift).toHaveLength(1);
    expect(enumDrift[0].severity).toBe('error');
  });

  it('does NOT emit enum-drift when both sides have no enum', () => {
    const sdk = makeSchema({ status: { type: 'string' } });
    const upstream = makeSchema({ status: { type: 'string' } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const enumDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'enum-drift'
    );
    expect(enumDrift).toHaveLength(0);
  });
});

// ─── nullable-mismatch ────────────────────────────────────────────────────────

describe('diffPair – nullable-mismatch', () => {
  it('emits nullable-mismatch when SDK and upstream disagree on nullable', () => {
    const sdk = makeSchema({ note: { type: 'string', nullable: false } });
    const upstream = makeSchema({ note: { type: 'string', nullable: true } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const nullDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'nullable-mismatch'
    );
    expect(nullDrift).toHaveLength(1);
    expect(nullDrift[0].severity).toBe('warn');
  });

  it('does not emit nullable-mismatch when both sides agree', () => {
    const sdk = makeSchema({ note: { type: 'string', nullable: true } });
    const upstream = makeSchema({ note: { type: 'string', nullable: true } });

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream });
    const nullDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'nullable-mismatch'
    );
    expect(nullDrift).toHaveLength(0);
  });
});

// ─── default-mismatch ────────────────────────────────────────────────────────

describe('diffPair – default-mismatch', () => {
  it('emits default-mismatch when primitive defaults differ', () => {
    const sdkFields = {
      per_page: {
        type: 'integer' as const,
        optional: true,
        nullable: false,
        readonly: false,
        additionalProperties: false,
        default: 5,
      },
    };
    const upstreamFields = {
      per_page: {
        type: 'integer' as const,
        optional: true,
        nullable: false,
        readonly: false,
        additionalProperties: false,
        default: 10,
      },
    };
    const sdk = { additionalProperties: true, fields: sdkFields };
    const upstream = { additionalProperties: true, fields: upstreamFields };

    const drifts = diffPair({ ...BASE_ARGS, sdk, upstream, kind: 'query' });
    const defaultDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'default-mismatch'
    );
    expect(defaultDrift).toHaveLength(1);
    expect(defaultDrift[0].severity).toBe('warn');
  });

  it('treats null and undefined default as equal (no drift)', () => {
    const makeWithDefault = (d: null | undefined) => ({
      additionalProperties: true,
      fields: {
        x: {
          type: 'string' as const,
          optional: true,
          nullable: false,
          readonly: false,
          additionalProperties: false,
          default: d,
        },
      },
    });

    const drifts = diffPair({
      ...BASE_ARGS,
      sdk: makeWithDefault(undefined),
      upstream: makeWithDefault(null),
    });
    const defaultDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'default-mismatch'
    );
    expect(defaultDrift).toHaveLength(0);
  });
});

// ─── description drift ───────────────────────────────────────────────────────

describe('diffPair – description drift kinds', () => {
  const makeSchemaWithDesc = (field: string, desc: string | undefined) => ({
    additionalProperties: true,
    fields: {
      [field]: {
        type: 'string',
        optional: false,
        nullable: false,
        readonly: false,
        additionalProperties: false,
        description: desc,
      },
    },
  });

  it('emits description-missing-in-sdk when only upstream has description', () => {
    const drifts = diffPair({
      ...BASE_ARGS,
      sdk: makeSchemaWithDesc('code', undefined),
      upstream: makeSchemaWithDesc('code', 'Coupon code'),
      options: { checkDescriptions: true },
    });
    const descDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'description-missing-in-sdk'
    );
    expect(descDrift).toHaveLength(1);
    expect(descDrift[0].severity).toBe('info');
  });

  it('emits description-missing-upstream when only SDK has description', () => {
    const drifts = diffPair({
      ...BASE_ARGS,
      sdk: makeSchemaWithDesc('code', 'Coupon code'),
      upstream: makeSchemaWithDesc('code', undefined),
      options: { checkDescriptions: true },
    });
    const descDrift = drifts.filter(
      (d: { driftKind: string }) =>
        d.driftKind === 'description-missing-upstream'
    );
    expect(descDrift).toHaveLength(1);
    expect(descDrift[0].severity).toBe('info');
  });

  it('emits description-mismatch when descriptions differ', () => {
    const drifts = diffPair({
      ...BASE_ARGS,
      sdk: makeSchemaWithDesc('code', 'Code'),
      upstream: makeSchemaWithDesc('code', 'Coupon code'),
      options: { checkDescriptions: true },
    });
    const descDrift = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'description-mismatch'
    );
    expect(descDrift).toHaveLength(1);
    expect(descDrift[0].severity).toBe('info');
  });

  it('suppresses all description drift when checkDescriptions:false', () => {
    const drifts = diffPair({
      ...BASE_ARGS,
      sdk: makeSchemaWithDesc('code', undefined),
      upstream: makeSchemaWithDesc('code', 'Coupon code'),
      options: { checkDescriptions: false },
    });
    const descDrift = drifts.filter((d: { driftKind: string }) =>
      d.driftKind.startsWith('description')
    );
    expect(descDrift).toHaveLength(0);
  });
});

// ─── context filtering ───────────────────────────────────────────────────────

describe('diffPair – context filtering on response (store surface)', () => {
  it('excludes upstream fields with context:["edit"] only from store comparison', () => {
    // Store surface: only view context is relevant.
    // An upstream field with context:['edit'] only should be excluded → no missing-in-sdk.
    const sdk = makeSchema({});
    const upstream = {
      additionalProperties: true,
      fields: {
        admin_note: {
          type: 'string',
          optional: true,
          nullable: false,
          readonly: false,
          additionalProperties: false,
          context: ['edit'],
        },
      },
    };

    const drifts = diffPair({
      surface: 'store',
      route: '/wc/store/v1/products',
      kind: 'response',
      sdk,
      upstream,
      options: { checkDescriptions: false },
    });
    const missing = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'missing-in-sdk'
    );
    expect(missing).toHaveLength(0);
  });

  it('includes upstream fields with context:["view"] in store comparison', () => {
    const sdk = makeSchema({});
    const upstream = {
      additionalProperties: true,
      fields: {
        name: {
          type: 'string',
          optional: false,
          nullable: false,
          readonly: false,
          additionalProperties: false,
          context: ['view'],
        },
      },
    };

    const drifts = diffPair({
      surface: 'store',
      route: '/wc/store/v1/products',
      kind: 'response',
      sdk,
      upstream,
      options: { checkDescriptions: false },
    });
    const missing = drifts.filter(
      (d: { driftKind: string }) => d.driftKind === 'missing-in-sdk'
    );
    expect(missing).toHaveLength(1);
    expect(missing[0].field).toBe('name');
  });
});
