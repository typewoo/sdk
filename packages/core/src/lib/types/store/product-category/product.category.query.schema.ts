import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductCategoryRequestSchema = PaginatedSchema.omit({
  offset: true,
}).extend({
  context: z
    .enum(['edit', 'embed', 'view'])
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
  per_page: z
    .number()
    .optional()
    .describe(
      'Maximum number of items to be returned in result set. Defaults to no limit if left blank.'
    ),
});

export type ProductCategoryRequest = z.infer<
  typeof ProductCategoryRequestSchema
>;
