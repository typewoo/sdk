import { z } from 'zod';

export const ProductTagResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
  count: z.number(),
});

export type ProductTagResponse = z.infer<typeof ProductTagResponseSchema>;
