import { z } from 'zod';

export const ProductCollectionDataTaxonomyCountsResponseSchema = z.looseObject({
  term: z.number(),
  count: z.number(),
});

export type ProductCollectionDataTaxonomyCountsResponse = z.infer<
  typeof ProductCollectionDataTaxonomyCountsResponseSchema
>;
