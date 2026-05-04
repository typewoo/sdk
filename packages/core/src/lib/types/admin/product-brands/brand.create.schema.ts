import { z } from 'zod';
import { AdminBrandImage } from './brand.js';

/**
 * Brand request parameters for POST /products/brands. `name` is required.
 */
export const AdminBrandCreateRequestSchema = z.looseObject({
  name: z.string().describe('Name for the resource.'),
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
    .default('default')
    .optional()
    .describe('Category archive display type.'),
  image: AdminBrandImage.optional().describe('Image data.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
});

export type AdminBrandCreateRequest = z.input<
  typeof AdminBrandCreateRequestSchema
>;
