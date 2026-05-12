import { z } from 'zod';

/**
 * WooCommerce REST API Product Attribute Response
 */
export const AdminProductAttributeSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Attribute name.'),
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
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductAttribute = z.infer<typeof AdminProductAttributeSchema>;
