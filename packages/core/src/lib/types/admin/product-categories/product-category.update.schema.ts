import { z } from 'zod';
import {
  AdminTaxonomyCategoryImage,
  AdminCategoryDisplaySchema,
} from './product-category.js';

export const AdminTaxonomyCategoryUpdateRequestSchema = z.looseObject({
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
  display: AdminCategoryDisplaySchema.optional().describe(
    'Category archive display type.'
  ),
  image: AdminTaxonomyCategoryImage.optional().describe('Image data.'),
});

export type AdminTaxonomyCategoryUpdateRequest = z.input<
  typeof AdminTaxonomyCategoryUpdateRequestSchema
>;
