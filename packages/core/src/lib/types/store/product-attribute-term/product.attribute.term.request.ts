import { z } from 'zod';

export const ProductAttributeTermRequestSchema = z.looseObject({
  attribute_id: z
    .number()
    .optional()
    .describe('Unique identifier for the attribute.'),
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
  /**
   * Current page of the collection.
   */
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  /**
   * Maximum number of items to be returned in result set.
   */
  per_page: z
    .number()
    .optional()
    .describe(
      'Maximum number of items to be returned in result set. Defaults to no limit if left blank.'
    ),
  /**
   * Order ascending or descending.
   * Allowed values: `asc`, `desc`
   */
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Sort ascending or descending.'),
  /**
   * Sort collection by looseObject attribute.
   * Allowed values: `id`, `name`, `name_num`, `slug`, `count`, `menu_order`.
   */
  orderby: z
    .enum(['id', 'name', 'name_num', 'slug', 'count', 'menu_order'])
    .default('name')
    .optional()
    .describe('Sort by term property.'),
});

export type ProductAttributeTermRequest = z.infer<
  typeof ProductAttributeTermRequestSchema
>;
