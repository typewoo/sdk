import { z } from 'zod';

/**
 * Product attribute term request parameters for POST .../terms (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeTermCreateRequestSchema = z.looseObject({
  name: z.string().describe('Name for the resource.'),
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
  attribute_id: z
    .number()
    .optional()
    .describe('Unique identifier for the attribute of the terms.'),
});

export type AdminProductAttributeTermCreateRequest = z.input<
  typeof AdminProductAttributeTermCreateRequestSchema
>;
