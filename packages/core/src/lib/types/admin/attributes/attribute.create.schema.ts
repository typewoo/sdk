import { z } from 'zod';

/**
 * Product attribute request parameters for POST /products/attributes (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeCreateRequestSchema = z.looseObject({
  name: z.string().describe('Name for the resource.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  type: z
    .enum(['select'])
    .default('select')
    .optional()
    .describe('Type of attribute.'),
  order_by: z
    .enum(['menu_order', 'name', 'name_num', 'id'])
    .default('menu_order')
    .optional()
    .describe('Default sort order.'),
  has_archives: z
    .boolean()
    .default(false)
    .optional()
    .describe('Enable/Disable attribute archives.'),
});

export type AdminProductAttributeCreateRequest = z.input<
  typeof AdminProductAttributeCreateRequestSchema
>;
