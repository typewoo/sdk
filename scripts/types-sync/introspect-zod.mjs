/**
 * Convert a Zod schema to the shared normalised shape.
 *
 * Uses Zod 4's z.toJSONSchema() which emits draft-2020-12 JSON Schema and
 * correctly represents z.looseObject as additionalProperties: true.
 */

import { z } from 'zod';
import { normaliseJsonSchema } from './normalise.mjs';

/**
 * @param {import('zod').ZodType} schema
 * @param {'response'|'request'|'query'} kind
 */
export function introspectZodSchema(schema, kind) {
  const io = kind === 'response' ? 'output' : 'input';
  const json = z.toJSONSchema(schema, {
    io,
    unrepresentable: 'any',
    target: 'draft-2020-12',
  });
  return normaliseJsonSchema(json);
}
