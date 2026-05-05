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

// ─── type aliases ─────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – WC type aliases', () => {
  for (const [wcType, expected] of [
    ['bool', { type: 'boolean' }],
    ['int', { type: 'integer' }],
    ['float', { type: 'number' }],
    ['mixed', { type: 'any' }],
    ['date-time', { type: 'string', format: 'date-time' }],
    ['uuid', { type: 'string', format: 'uuid' }],
    ['uri', { type: 'string', format: 'uri' }],
    ['email', { type: 'string', format: 'email' }],
  ] as const) {
    it(`normalises WC type "${wcType}" to ${JSON.stringify(expected)}`, () => {
      const schema = {
        type: 'object',
        properties: { field: { type: wcType } },
      };
      const { fields } = normaliseJsonSchema(schema);
      expect(fields['field'].type).toBe(expected.type);
      if ('format' in expected) {
        expect(fields['field'].format).toBe(expected.format);
      }
    });
  }
});

// ─── union type arrays (nullable) ────────────────────────────────────────────

describe('normaliseJsonSchema – union type array (nullable)', () => {
  it('collapses ["string","null"] to type:string, nullable:true', () => {
    const schema = {
      type: 'object',
      properties: { note: { type: ['string', 'null'] } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['note'].type).toBe('string');
    expect(fields['note'].nullable).toBe(true);
  });

  it('collapses ["null","integer"] to type:integer, nullable:true', () => {
    const schema = {
      type: 'object',
      properties: { count: { type: ['null', 'integer'] } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['count'].type).toBe('integer');
    expect(fields['count'].nullable).toBe(true);
  });
});

// ─── anyOf/oneOf nullable unwrapping ─────────────────────────────────────────

describe('normaliseJsonSchema – anyOf/oneOf nullable unwrapping', () => {
  it('unwraps anyOf:[{type:string},{type:null}] to type:string, nullable:true', () => {
    const schema = {
      type: 'object',
      properties: {
        note: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['note'].type).toBe('string');
    expect(fields['note'].nullable).toBe(true);
  });

  it('preserves parent description through nullable collapse', () => {
    const schema = {
      type: 'object',
      properties: {
        note: {
          description: 'A note',
          anyOf: [{ type: 'string' }, { type: 'null' }],
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['note'].description).toBe('A note');
  });

  it('preserves parent default through nullable collapse', () => {
    const schema = {
      type: 'object',
      properties: {
        count: {
          default: 0,
          anyOf: [{ type: 'integer' }, { type: 'null' }],
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['count'].default).toBe(0);
  });

  it('preserves parent readonly through nullable collapse', () => {
    const schema = {
      type: 'object',
      properties: {
        id: {
          readonly: true,
          anyOf: [{ type: 'integer' }, { type: 'null' }],
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['id'].readonly).toBe(true);
  });
});

// ─── enum ─────────────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – enum', () => {
  it('sorts enum values alphabetically', () => {
    const schema = {
      type: 'object',
      properties: { status: { type: 'string', enum: ['z', 'a', 'm'] } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['status'].enum).toEqual(['a', 'm', 'z']);
  });

  it('deduplicates enum values', () => {
    const schema = {
      type: 'object',
      properties: { status: { type: 'string', enum: ['a', 'a', 'b'] } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['status'].enum).toEqual(['a', 'b']);
  });

  it('reclassifies number type with all-string enum entries as type:string', () => {
    // WC inconsistency: `{type:"number", enum:["currency","number"]}`
    const schema = {
      type: 'object',
      properties: {
        format: { type: 'number', enum: ['currency', 'number'] },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['format'].type).toBe('string');
  });
});

// ─── arrays ───────────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – array fields', () => {
  it('captures items.type for a simple array', () => {
    const schema = {
      type: 'object',
      properties: { tags: { type: 'array', items: { type: 'string' } } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['tags'].type).toBe('array');
    expect(fields['tags'].items?.type).toBe('string');
  });

  it('captures items.enum when items has an enum', () => {
    const schema = {
      type: 'object',
      properties: {
        include_status: {
          type: 'array',
          items: { type: 'string', enum: ['pending', 'completed', 'active'] },
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['include_status'].items?.type).toBe('string');
    expect(fields['include_status'].items?.enum).toEqual([
      'active',
      'completed',
      'pending',
    ]);
  });

  it('defaults items to type:any when items is missing', () => {
    const schema = {
      type: 'object',
      properties: { ids: { type: 'array' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['ids'].items?.type).toBe('any');
  });

  it('does NOT capture a scalar string default on an array field (false positive prevention)', () => {
    const schema = {
      type: 'object',
      properties: { status: { type: 'array', default: 'any' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    // scalar default on array → treated as no default
    expect(fields['status'].default).toBeUndefined();
  });

  it('DOES capture an array default on an array field', () => {
    const schema = {
      type: 'object',
      properties: { status: { type: 'array', default: ['pending'] } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['status'].default).toEqual(['pending']);
  });
});

// ─── context ──────────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – context', () => {
  it('preserves context array on the field descriptor', () => {
    const schema = {
      type: 'object',
      properties: {
        internal_note: { type: 'string', context: ['view', 'edit'] },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['internal_note'].context).toEqual(['view', 'edit']);
  });

  it('leaves context undefined when absent', () => {
    const schema = {
      type: 'object',
      properties: { code: { type: 'string' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].context).toBeUndefined();
  });
});

// ─── description ──────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – description', () => {
  it('propagates description string from the field node', () => {
    const schema = {
      type: 'object',
      properties: { code: { type: 'string', description: 'Coupon code' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].description).toBe('Coupon code');
  });

  it('leaves description undefined when absent', () => {
    const schema = {
      type: 'object',
      properties: { code: { type: 'string' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['code'].description).toBeUndefined();
  });
});

// ─── default ──────────────────────────────────────────────────────────────────

describe('normaliseJsonSchema – default', () => {
  it('captures integer default', () => {
    const schema = {
      type: 'object',
      properties: { per_page: { type: 'integer', default: 10 } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['per_page'].default).toBe(10);
  });

  it('captures string default', () => {
    const schema = {
      type: 'object',
      properties: { context: { type: 'string', default: 'view' } },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['context'].default).toBe('view');
  });
});

// ─── dot-path recursion ───────────────────────────────────────────────────────

describe('normaliseJsonSchema – nested object recursion', () => {
  it('emits dot-path keys for nested object properties', () => {
    const schema = {
      type: 'object',
      properties: {
        billing: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            zip: { type: 'string' },
          },
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['billing.city']).toBeDefined();
    expect(fields['billing.city'].type).toBe('string');
    expect(fields['billing.zip']).toBeDefined();
    // The parent 'billing' field is also present
    expect(fields['billing'].type).toBe('object');
  });

  it('handles three levels of nesting', () => {
    const schema = {
      type: 'object',
      properties: {
        shipping: {
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: { line1: { type: 'string' } },
            },
          },
        },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['shipping.address.line1']).toBeDefined();
  });
});

// ─── additionalProperties ────────────────────────────────────────────────────

describe('normaliseJsonSchema – additionalProperties', () => {
  it('marks root schema as open when additionalProperties is true', () => {
    const schema = {
      type: 'object',
      additionalProperties: true,
      properties: {},
    };
    const result = normaliseJsonSchema(schema);
    expect(result.additionalProperties).toBe(true);
  });

  it('marks root schema as open when additionalProperties is empty object {}', () => {
    const schema = { type: 'object', additionalProperties: {}, properties: {} };
    const result = normaliseJsonSchema(schema);
    expect(result.additionalProperties).toBe(true);
  });

  it('marks root schema as strict when additionalProperties is false', () => {
    const schema = {
      type: 'object',
      additionalProperties: false,
      properties: { id: { type: 'integer' } },
    };
    const result = normaliseJsonSchema(schema);
    expect(result.additionalProperties).toBe(false);
  });

  it('marks root schema as strict when additionalProperties absent and properties present', () => {
    const schema = { type: 'object', properties: { id: { type: 'integer' } } };
    const result = normaliseJsonSchema(schema);
    expect(result.additionalProperties).toBe(false);
  });

  it('marks object field as open when its additionalProperties is true', () => {
    const schema = {
      type: 'object',
      properties: {
        meta: { type: 'object', additionalProperties: true },
      },
    };
    const { fields } = normaliseJsonSchema(schema);
    expect(fields['meta'].additionalProperties).toBe(true);
  });
});
