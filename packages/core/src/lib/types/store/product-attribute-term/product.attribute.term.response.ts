import { z } from 'zod';

export const ProductAttributeTermResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  count: z.number(),
});

export type ProductAttributeTermResponse = z.infer<
  typeof ProductAttributeTermResponseSchema
>;
