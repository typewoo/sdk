/**
 * End-to-end drift detection: raw JSON Schema on both sides → normaliser →
 * diff. Guards against blind spots where a real type difference used to
 * produce no drift at all.
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// @ts-expect-error -- .mjs module without types
import { normaliseJsonSchema } from '../normalise.mjs';
// @ts-expect-error -- .mjs module without types
import { diffPair } from '../diff.mjs';

const ARGS = {
  surface: 'admin',
  route: '/wc/v3/example',
  kind: 'response',
  options: { checkDescriptions: false },
} as const;

/** Diff an SDK Zod field against an upstream JSON Schema field. */
function driftKinds(sdkField: z.ZodType, upstreamField: object) {
  const sdk = normaliseJsonSchema(
    z.toJSONSchema(z.object({ value: sdkField }), { io: 'input' })
  );
  const upstream = normaliseJsonSchema({
    type: 'object',
    required: ['value'],
    properties: { value: upstreamField },
  });
  return diffPair({ ...ARGS, sdk, upstream })
    .filter((d: { field: string }) => d.field === 'value')
    .map((d: { driftKind: string }) => d.driftKind);
}

describe('array element types', () => {
  it('flags an array whose element type differs', () => {
    expect(
      driftKinds(z.array(z.string()), {
        type: 'array',
        items: { type: 'integer' },
      })
    ).toContain('type-mismatch');
  });

  it('accepts number elements against integer elements', () => {
    expect(
      driftKinds(z.array(z.number()), {
        type: 'array',
        items: { type: 'integer' },
      })
    ).toEqual([]);
  });

  it('accepts a union element that includes the upstream type', () => {
    expect(
      driftKinds(z.array(z.union([z.string(), z.number()])), {
        type: 'array',
        items: { type: 'string' },
      })
    ).toEqual([]);
  });
});

describe('unions', () => {
  it('flags a union with no overlap instead of treating it as any', () => {
    expect(
      driftKinds(z.union([z.boolean(), z.number()]), { type: 'string' })
    ).toContain('type-mismatch');
  });

  it('keeps every branch of a nullable union', () => {
    const sdk = normaliseJsonSchema(
      z.toJSONSchema(
        z.object({ v: z.union([z.string(), z.number()]).nullable() })
      )
    );
    expect(sdk.fields.v.types).toEqual(['number', 'string']);
    expect(sdk.fields.v.nullable).toBe(true);
  });

  it('turns a union of literals into an enum', () => {
    const sdk = normaliseJsonSchema(
      z.toJSONSchema(z.object({ v: z.union([z.literal('a'), z.literal('b')]) }))
    );
    expect(sdk.fields.v.enum).toEqual(['a', 'b']);
  });

  it('reports a $ref as unsupported rather than matching anything', () => {
    const upstream = normaliseJsonSchema({
      type: 'object',
      properties: { v: { $ref: '#/definitions/thing' } },
    });
    expect(upstream.fields.v.type).toBe('unsupported');
  });
});

describe('object elements of arrays', () => {
  const sdkSchema = z.object({
    line_items: z.array(z.object({ wrong: z.boolean() })),
  });
  const upstreamSchema = {
    type: 'object',
    required: ['line_items'],
    properties: {
      line_items: {
        type: 'array',
        items: {
          type: 'object',
          properties: { name: { type: 'string' }, qty: { type: 'integer' } },
        },
      },
    },
  };

  it('walks element properties as field[].child paths', () => {
    const upstream = normaliseJsonSchema(upstreamSchema);
    expect(Object.keys(upstream.fields)).toEqual([
      'line_items',
      'line_items[].name',
      'line_items[].qty',
    ]);
  });

  it('reports element fields that differ from upstream', () => {
    const drifts = diffPair({
      ...ARGS,
      sdk: normaliseJsonSchema(z.toJSONSchema(sdkSchema, { io: 'input' })),
      upstream: normaliseJsonSchema(upstreamSchema),
    });
    const byField = Object.fromEntries(
      drifts.map((d: { field: string; driftKind: string }) => [
        d.field,
        d.driftKind,
      ])
    );
    expect(byField['line_items[].wrong']).toBe('extra-in-sdk');
    expect(byField['line_items[].name']).toBe('missing-in-sdk');
  });

  it('skips element fields when the upstream snapshot has none recorded', () => {
    const drifts = diffPair({
      ...ARGS,
      sdk: normaliseJsonSchema(z.toJSONSchema(sdkSchema, { io: 'input' })),
      upstream: normaliseJsonSchema({
        type: 'object',
        required: ['line_items'],
        properties: {
          line_items: { type: 'array', items: { type: 'object' } },
        },
      }),
    });
    expect(drifts).toEqual([]);
  });
});

describe('nested requiredness', () => {
  const sdkShape = (key: z.ZodType) =>
    normaliseJsonSchema(
      z.toJSONSchema(
        z.object({
          meta: z.array(z.object({ key, value: z.string() })).optional(),
        }),
        { io: 'input' }
      )
    );
  const upstreamShape = (
    keyNode: object,
    valueNode: object = { type: 'string' }
  ) =>
    normaliseJsonSchema({
      type: 'object',
      properties: {
        meta: {
          type: 'array',
          items: {
            type: 'object',
            properties: { key: keyNode, value: valueNode },
          },
        },
      },
    });
  const optionalDrift = (sdk: object, upstream: object) =>
    diffPair({ ...ARGS, kind: 'request', sdk, upstream }).filter(
      (d: { driftKind: string }) => d.driftKind === 'optional-mismatch'
    );

  it('ignores optionality when upstream declares none for the object', () => {
    expect(
      optionalDrift(sdkShape(z.string()), upstreamShape({ type: 'string' }))
    ).toEqual([]);
  });

  it('honours WP-style `required: true` on a nested property', () => {
    const upstream = upstreamShape(
      { type: 'string', required: true },
      { type: 'string', required: true }
    );
    expect(upstream.fields['meta[].key'].optional).toBe(false);
    expect(
      optionalDrift(sdkShape(z.string().optional()), upstream).map(
        (d: { field: string }) => d.field
      )
    ).toEqual(['meta[].key']);
  });
});

describe('fields that carry no drift signal', () => {
  it('ignores read-only upstream fields in request shapes', () => {
    const sdk = normaliseJsonSchema(
      z.toJSONSchema(z.object({ code: z.string().optional() }), {
        io: 'input',
      })
    );
    const upstream = normaliseJsonSchema({
      type: 'object',
      properties: {
        code: { type: 'string' },
        discount_type: { type: 'string', readonly: true },
      },
    });
    expect(diffPair({ ...ARGS, kind: 'request', sdk, upstream })).toEqual([]);
    expect(
      diffPair({ ...ARGS, sdk, upstream }).map(
        (d: { field: string }) => d.field
      )
    ).toEqual(['discount_type']);
  });

  it('treats an upstream `any` type as already nullable', () => {
    expect(driftKinds(z.string().nullable(), {})).toEqual([]);
  });

  it('does not walk properties attached to non-object array items', () => {
    const { fields } = normaliseJsonSchema({
      type: 'object',
      properties: {
        rows: {
          type: 'array',
          items: { type: 'array', properties: { display: { type: 'string' } } },
        },
      },
    });
    expect(Object.keys(fields)).toEqual(['rows']);
  });
});
