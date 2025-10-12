import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProductCollectionDataTaxonomyCountsResponseSchema = z.object({
  term: z.number(),
  count: z.number(),
});

export type ProductCollectionDataTaxonomyCountsResponse = z.infer<
  typeof ProductCollectionDataTaxonomyCountsResponseSchema
>;
export class ApiProductCollectionDataTaxonomyCountsResponse extends createZodDto(
  ProductCollectionDataTaxonomyCountsResponseSchema
) {}
