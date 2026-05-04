import { z } from 'zod';

export const AdminBrandQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific ids.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum([
      'id',
      'include',
      'name',
      'slug',
      'term_group',
      'description',
      'count',
    ])
    .default('name')
    .optional()
    .describe('Sort collection by resource attribute.'),
  hide_empty: z
    .boolean()
    .default(false)
    .optional()
    .describe('Whether to hide resources not assigned to any products.'),
  parent: z
    .number()
    .optional()
    .describe(
      'Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.'
    ),
  product: z
    .number()
    .optional()
    .describe('Limit result set to resources assigned to a specific product.'),
  slug: z
    .string()
    .optional()
    .describe('Limit result set to resources with a specific slug.'),
});

export type AdminBrandQueryParams = z.infer<typeof AdminBrandQueryParamsSchema>;
