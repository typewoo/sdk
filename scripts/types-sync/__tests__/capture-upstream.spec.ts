/**
 * Unit tests for the pure helper functions exported from capture-upstream.mjs.
 * No live HTTP calls — only tests the URL-building and schema-shaping logic.
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import {
  concretiseRoute,
  argsToSchema,
  shapeRouteEntry,
} from '../capture-upstream.mjs';

// ─── concretiseRoute ──────────────────────────────────────────────────────────

describe('concretiseRoute', () => {
  it('replaces a single WP REST regex placeholder with 1', () => {
    expect(concretiseRoute('/wc/v3/orders/(?P<id>[\\d]+)')).toBe(
      '/wc/v3/orders/1'
    );
  });

  it('replaces multiple placeholders with 1', () => {
    expect(
      concretiseRoute('/wc/v3/orders/(?P<order_id>[\\d]+)/notes/(?P<id>[\\d]+)')
    ).toBe('/wc/v3/orders/1/notes/1');
  });

  it('returns routes with no placeholders unchanged', () => {
    expect(concretiseRoute('/wc/v3/coupons')).toBe('/wc/v3/coupons');
  });

  it('handles non-numeric placeholder patterns (falls back to 1)', () => {
    expect(concretiseRoute('/wc/v3/reports/(?P<slug>[a-z-]+)')).toBe(
      '/wc/v3/reports/1'
    );
  });
});

// ─── argsToSchema ─────────────────────────────────────────────────────────────

describe('argsToSchema', () => {
  it('returns an empty schema for null/undefined args', () => {
    const schema = argsToSchema(null);
    expect(schema.type).toBe('object');
    expect(schema.properties).toEqual({});
    expect(schema.required).toEqual([]);
  });

  it('returns an empty schema for non-object args', () => {
    const schema = argsToSchema('not-an-object');
    expect(schema.type).toBe('object');
    expect(schema.properties).toEqual({});
  });

  it('maps a simple arg to a properties entry with type', () => {
    const schema = argsToSchema({
      per_page: { type: 'integer', description: 'Items per page' },
    });
    expect(schema.properties['per_page'].type).toBe('integer');
    expect(schema.properties['per_page'].description).toBe('Items per page');
  });

  it('adds to required[] when the arg has required:true', () => {
    const schema = argsToSchema({
      code: { type: 'string', required: true },
      note: { type: 'string', required: false },
    });
    expect(schema.required).toContain('code');
    expect(schema.required).not.toContain('note');
  });

  it('preserves enum on a field', () => {
    const schema = argsToSchema({
      status: { type: 'string', enum: ['active', 'inactive'] },
    });
    expect(schema.properties['status'].enum).toEqual(['active', 'inactive']);
  });

  it('preserves items for array-type args', () => {
    const schema = argsToSchema({
      include: { type: 'array', items: { type: 'integer' } },
    });
    expect(schema.properties['include'].items).toEqual({ type: 'integer' });
  });

  it('skips null/non-object entries in args map', () => {
    const schema = argsToSchema({ bad: null, good: { type: 'string' } });
    expect(schema.properties['bad']).toBeUndefined();
    expect(schema.properties['good']).toBeDefined();
  });

  it('falls back to type:any when arg has no type', () => {
    const schema = argsToSchema({ misc: { description: 'no type' } });
    expect(schema.properties['misc'].type).toBe('any');
  });
});

// ─── shapeRouteEntry ─────────────────────────────────────────────────────────

describe('shapeRouteEntry', () => {
  it('returns null response when routeDef has no schema', () => {
    const entry = shapeRouteEntry({ endpoints: [] });
    expect(entry.response).toBeNull();
  });

  it('normalises the response schema when routeDef.schema is present', () => {
    const routeDef = {
      schema: {
        type: 'object',
        properties: { id: { type: 'integer' } },
        required: ['id'],
      },
      endpoints: [],
    };
    const entry = shapeRouteEntry(routeDef);
    expect(entry.response).not.toBeNull();
    expect(entry.response.fields['id'].type).toBe('integer');
  });

  it('places GET endpoint args into query map', () => {
    const routeDef = {
      endpoints: [
        {
          methods: ['GET'],
          args: { per_page: { type: 'integer' } },
        },
      ],
    };
    const entry = shapeRouteEntry(routeDef);
    expect(entry.query['GET']).toBeDefined();
    expect(entry.query['GET'].fields['per_page'].type).toBe('integer');
  });

  it('places POST endpoint args into request map', () => {
    const routeDef = {
      endpoints: [
        {
          methods: ['POST'],
          args: { code: { type: 'string', required: true } },
        },
      ],
    };
    const entry = shapeRouteEntry(routeDef);
    expect(entry.request['POST']).toBeDefined();
    expect(entry.request['POST'].fields['code'].type).toBe('string');
  });

  it('places PUT and PATCH endpoint args into request map', () => {
    const routeDef = {
      endpoints: [
        { methods: ['PUT'], args: { code: { type: 'string' } } },
        { methods: ['PATCH'], args: { amount: { type: 'number' } } },
      ],
    };
    const entry = shapeRouteEntry(routeDef);
    expect(entry.request['PUT']).toBeDefined();
    expect(entry.request['PATCH']).toBeDefined();
  });

  it('handles routeDef with no endpoints gracefully', () => {
    const entry = shapeRouteEntry({});
    expect(entry.response).toBeNull();
    expect(entry.request).toEqual({});
    expect(entry.query).toEqual({});
  });

  it('returns empty maps when routeDef is null/undefined', () => {
    const entry = shapeRouteEntry(null);
    expect(entry.response).toBeNull();
    expect(entry.request).toEqual({});
    expect(entry.query).toEqual({});
  });
});
