import { z } from 'zod';

/**
 * WooCommerce REST API Product Attribute Term Response
 */
export const AdminProductAttributeTermSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Term name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductAttributeTerm = z.infer<
  typeof AdminProductAttributeTermSchema
>;
