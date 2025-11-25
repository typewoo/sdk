import { z } from 'zod';

export const ProductCollectionDataAttributeCountsResponseSchema = z.object({
  term: z.number(),
  count: z.number(),
});

export type ProductCollectionDataAttributeCountsResponse = z.infer<
  typeof ProductCollectionDataAttributeCountsResponseSchema
>;
