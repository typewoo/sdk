import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProductCollectionDataRatingCountsResponseSchema = z.object({
  rating: z.number(),
  count: z.number(),
});

export type ProductCollectionDataRatingCountsResponse = z.infer<
  typeof ProductCollectionDataRatingCountsResponseSchema
>;
export class ApiProductCollectionDataRatingCountsResponse extends createZodDto(
  ProductCollectionDataRatingCountsResponseSchema
) {}
