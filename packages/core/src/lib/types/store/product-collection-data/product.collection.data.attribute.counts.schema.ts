import { z } from 'zod';

export const ProductCollectionDataAttributeCountsResponseSchema = z.looseObject(
  {
    term: z.number(),
    count: z.number(),
  }
);

export type ProductCollectionDataAttributeCountsResponse = z.infer<
  typeof ProductCollectionDataAttributeCountsResponseSchema
>;
