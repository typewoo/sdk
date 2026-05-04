import { z } from 'zod';

export const AdminBrandImage = z.object({
  id: z.number().optional().describe('Image ID.'),
  date_created: z
    .string()
    .nullable()
    .describe("The date the image was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .nullable()
    .describe('The date the image was created, as GMT.'),
  date_modified: z
    .string()
    .nullable()
    .describe("The date the image was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .nullable()
    .describe('The date the image was last modified, as GMT.'),
  src: z.string().optional().describe('Image URL.'),
  name: z.string().optional().describe('Image name.'),
  alt: z.string().optional().describe('Image alternative text.'),
});
