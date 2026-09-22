/**
 * Unit tests for introspect-zod.mjs — verifies that Zod schemas are correctly
 * converted to the shared normalised shape via Zod 4's z.toJSONSchema().
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

// @ts-expect-error -- .mjs module without types
import { introspectZodSchema } from '../introspect-zod.mjs';

describe('introspectZodSchema – basic object', () => {
  it('extracts primitive field types from a flat object', () => {
    const schema = z.object({ id: z.number(), name: z.string() });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['id'].type).toBe('number');
    expect(fields['name'].type).toBe('string');
  });

  it('marks required fields as optional:false', () => {
    const schema = z.object({ id: z.number() });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['id'].optional).toBe(false);
  });

  it('marks optional fields as optional:true', () => {
    const schema = z.object({ note: z.string().optional() });
    const { fields } = introspectZodSchema(schema, 'request');
    expect(fields['note'].optional).toBe(true);
  });
});

describe('introspectZodSchema – enum', () => {
  it('extracts sorted enum values from z.enum()', () => {
    const schema = z.object({
      status: z.enum(['pending', 'active', 'cancelled']),
    });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['status'].enum).toEqual(['active', 'cancelled', 'pending']);
  });
});

describe('introspectZodSchema – nullable', () => {
  it('marks a nullable field as nullable:true', () => {
    const schema = z.object({ note: z.string().nullable() });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['note'].nullable).toBe(true);
  });

  it('marks a non-nullable field as nullable:false', () => {
    const schema = z.object({ name: z.string() });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['name'].nullable).toBe(false);
  });
});

describe('introspectZodSchema – default values', () => {
  it('captures a default value for query kind (input io)', () => {
    const schema = z.object({ per_page: z.number().default(10) });
    const { fields } = introspectZodSchema(schema, 'query');
    expect(fields['per_page'].default).toBe(10);
  });

  it('does not emit a default for response kind (output io) without one', () => {
    const schema = z.object({ id: z.number() });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['id'].default).toBeUndefined();
  });
});

describe('introspectZodSchema – descriptions', () => {
  it('propagates .describe() text to the field descriptor', () => {
    const schema = z.object({ code: z.string().describe('Coupon code') });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['code'].description).toBe('Coupon code');
  });
});

describe('introspectZodSchema – loose object (additionalProperties)', () => {
  it('marks z.looseObject as additionalProperties:true', () => {
    const schema = z.looseObject({ id: z.number() });
    const result = introspectZodSchema(schema, 'response');
    expect(result.additionalProperties).toBe(true);
  });

  it('marks z.object (strict) as additionalProperties:false', () => {
    const schema = z.object({ id: z.number() });
    const result = introspectZodSchema(schema, 'response');
    expect(result.additionalProperties).toBe(false);
  });
});

describe('introspectZodSchema – nested object', () => {
  it('flattens nested object properties to dot-paths', () => {
    const schema = z.object({
      billing: z.object({ city: z.string(), zip: z.string() }),
    });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['billing.city']).toBeDefined();
    expect(fields['billing.city'].type).toBe('string');
    expect(fields['billing.zip']).toBeDefined();
  });
});

describe('introspectZodSchema – array', () => {
  it('marks array fields with type:array and captures items type', () => {
    const schema = z.object({ tags: z.array(z.string()) });
    const { fields } = introspectZodSchema(schema, 'response');
    expect(fields['tags'].type).toBe('array');
    expect(fields['tags'].items?.type).toBe('string');
  });
});
