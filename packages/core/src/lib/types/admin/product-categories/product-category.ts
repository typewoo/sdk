import { z } from 'zod';

export const AdminTaxonomyCategoryImage = z.object({
  id: z.number().optional().describe('Image ID.'),
  date_created: z
    .string()
    .optional()
    .describe("The date the image was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .optional()
    .describe('The date the image was created, as GMT.'),
  date_modified: z
    .string()
    .optional()
    .describe("The date the image was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .optional()
    .describe('The date the image was last modified, as GMT.'),
  src: z.string().optional().describe('Image URL.'),
  name: z.string().optional().describe('Image name.'),
  alt: z.string().optional().describe('Image alternative text.'),
});

/** Request variant — upstream POST/PATCH exposes date fields as nullable. */
export const AdminTaxonomyCategoryImageRequest = z.object({
  id: z.number().optional().describe('Image ID.'),
  date_created: z
    .string()
    .nullable()
    .optional()
    .describe("The date the image was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .nullable()
    .optional()
    .describe('The date the image was created, as GMT.'),
  date_modified: z
    .string()
    .nullable()
    .optional()
    .describe("The date the image was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .nullable()
    .optional()
    .describe('The date the image was last modified, as GMT.'),
  src: z.string().optional().describe('Image URL.'),
  name: z.string().optional().describe('Image name.'),
  alt: z.string().optional().describe('Image alternative text.'),
});

export const AdminCategoryDisplaySchema = z.enum([
  'default',
  'products',
  'subcategories',
  'both',
]);

export type AdminCategoryDisplay = z.infer<typeof AdminCategoryDisplaySchema>;
