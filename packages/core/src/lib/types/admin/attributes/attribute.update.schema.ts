import { z } from 'zod';

/**
 * Product attribute request parameters for PUT /products/attributes/{id}.
 */
export const AdminProductAttributeUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  type: z.enum(['select']).optional().describe('Type of attribute.'),
  order_by: z
    .enum(['menu_order', 'name', 'name_num', 'id'])
    .optional()
    .describe('Default sort order.'),
  has_archives: z
    .boolean()
    .optional()
    .describe('Enable/Disable attribute archives.'),
});

export type AdminProductAttributeUpdateRequest = z.input<
  typeof AdminProductAttributeUpdateRequestSchema
>;
