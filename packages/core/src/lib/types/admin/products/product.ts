import { z } from 'zod';

export const AdminProductMetaData = z.object({
  id: z.number(),
  key: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

export const AdminProductImage = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  src: z.string(),
  name: z.string(),
  alt: z.string(),
});

export const AdminProductDimensions = z.object({
  length: z.string().optional().describe('Product length (in).'),
  width: z.string().optional().describe('Product width (in).'),
  height: z.string().optional().describe('Product height (in).'),
});
