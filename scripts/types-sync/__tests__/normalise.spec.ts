/**
 * Unit tests for normalise.mjs — focused on the `optional` and `readonly`
 * field derivation logic.
 */

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- .mjs module without types
import { normaliseJsonSchema } from '../normalise.mjs';

describe('normaliseJsonSchema – optional resolution', () => {
  it('marks a field as optional:false when it is in the required array', () => {
    const schema = {
      type: 'object',
      properties: { id: { type: 'integer' } },
      required: ['id'],
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['id'].optional).toBe(false);
  });

  it('marks a field as optional:true when it is NOT in the required array', () => {
    const schema = {
      type: 'object',
      properties: { code: { type: 'string' } },
      required: [],
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].optional).toBe(true);
  });

  it('marks a field as optional:true when there is no required array at all', () => {
    const schema = {
      type: 'object',
      properties: { amount: { type: 'string' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['amount'].optional).toBe(true);
  });

  it('marks a readonly:true field as optional:false regardless of required array', () => {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', readonly: true },
        date_created: { type: 'string', readonly: true },
      },
      // no required array — WC convention for response schemas
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['id'].optional).toBe(false);
    expect(fields['date_created'].optional).toBe(false);
  });

  it('does NOT override optional for readonly:false fields — still uses required array', () => {
    const schema = {
      type: 'object',
      properties: {
        code: { type: 'string', readonly: false },
      },
      required: [],
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].optional).toBe(true);
  });

  it('preserves readonly:true on the normalised field descriptor', () => {
    const schema = {
      type: 'object',
      properties: { id: { type: 'integer', readonly: true } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['id'].readonly).toBe(true);
  });

  it('preserves readonly:false on the normalised field descriptor', () => {
    const schema = {
      type: 'object',
      properties: { code: { type: 'string', readonly: false } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].readonly).toBe(false);
  });
});
