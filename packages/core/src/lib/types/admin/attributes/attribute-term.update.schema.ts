import { z } from 'zod';

/**
 * Product attribute term request parameters for PUT .../terms/{id}.
 */
export const AdminProductAttributeTermUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
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
});

export type AdminProductAttributeTermUpdateRequest = z.input<
  typeof AdminProductAttributeTermUpdateRequestSchema
>;
