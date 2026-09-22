import { z } from 'zod';
import { AdminBrandImage } from './brand.js';

export const AdminBrandSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
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
    .default('default')
    .optional()
    .describe('Category archive display type.'),
  image: AdminBrandImage.nullish().describe('Image data.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })).optional(),
  }),
});

export type AdminBrand = z.infer<typeof AdminBrandSchema>;
