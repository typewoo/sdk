import { z } from 'zod';
import { AdminBrandImageRequest } from './brand.js';

/**
 * Brand request parameters for PUT /products/brands/{id}.
 */
export const AdminBrandUpdateRequestSchema = z.looseObject({
  name: z.string().optional().describe('Category name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  parent: z
    .number()
    .optional()
    .describe('The ID for the parent of the resource.'),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  display: z
    .enum(['default', 'products', 'subcategories', 'both'])
    .optional()
    .describe('Category archive display type.'),
  image: AdminBrandImageRequest.optional().describe('Image data.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
  id: z.number().optional().describe('Unique identifier for the resource.'),
});

export type AdminBrandUpdateRequest = z.input<
  typeof AdminBrandUpdateRequestSchema
>;
