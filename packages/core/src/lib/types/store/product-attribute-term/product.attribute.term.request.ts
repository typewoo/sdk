import { z } from 'zod';

export const ProductAttributeTermRequestSchema = z.looseObject({
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
    .describe('Maximum number of items to be returned in result set.'),
  /**
   * Order ascending or descending.
   * Allowed values: `asc`, `desc`
   */
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  /**
   * Sort collection by looseObject attribute.
   * Allowed values: `id`, `name`, `name_num`, `slug`, `count`, `menu_order`.
   */
  orderby: z
    .enum(['id', 'name', 'name_num', 'slug', 'count', 'menu_order'])
    .default('name')
    .optional()
    .describe('Sort collection by object attribute.'),
});

export type ProductAttributeTermRequest = z.infer<
  typeof ProductAttributeTermRequestSchema
>;
