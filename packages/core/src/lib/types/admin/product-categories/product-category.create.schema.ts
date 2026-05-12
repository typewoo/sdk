import { z } from 'zod';
import {
  AdminTaxonomyCategoryImageRequest,
  AdminCategoryDisplaySchema,
} from './product-category.js';

export const AdminTaxonomyCategoryCreateRequestSchema = z.looseObject({
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
  display: AdminCategoryDisplaySchema.default('default')
    .optional()
    .describe('Category archive display type.'),
  image: AdminTaxonomyCategoryImageRequest.optional().describe('Image data.'),
});

export type AdminTaxonomyCategoryCreateRequest = z.input<
  typeof AdminTaxonomyCategoryCreateRequestSchema
>;
