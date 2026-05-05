import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductTagRequestSchema = PaginatedSchema.omit({
  offset: true,
}).extend({
  per_page: z
    .number()
    .optional()
    .describe(
      'Maximum number of items to be returned in result set. Defaults to no limit if left blank.'
    ),
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  hide_empty: z
    .boolean()
    .default(true)
    .optional()
    .describe('If true, empty terms will not be returned.'),
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific ids.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Sort ascending or descending.'),
  orderby: z
    .enum(['count', 'name', 'slug'])
    .default('name')
    .optional()
    .describe('Sort by term property.'),
  parent: z
    .number()
    .optional()
    .describe(
      'Limit results to terms with a specific parent (hierarchical taxonomies only).'
    ),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
});

export type ProductTagRequest = z.infer<typeof ProductTagRequestSchema>;
