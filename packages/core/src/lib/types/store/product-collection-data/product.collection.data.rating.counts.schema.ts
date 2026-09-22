import { z } from 'zod';

export const ProductCollectionDataRatingCountsResponseSchema = z.looseObject({
  rating: z.number(),
  count: z.number(),
});

export type ProductCollectionDataRatingCountsResponse = z.infer<
  typeof ProductCollectionDataRatingCountsResponseSchema
>;
