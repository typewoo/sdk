import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ProductCollectionDataAttributeCountsResponseSchema } from './product.collection.data.attribute.counts.response.js';
import { ProductCollectionDataPriceRangeResponseSchema } from './product.collection.data.price.range.response.js';
import { ProductCollectionDataRatingCountsResponseSchema } from './product.collection.data.rating.counts.response.js';
import { ProductCollectionDataTaxonomyCountsResponseSchema } from './product.collection.data.taxonomy.counts.response.js';

export const ProductCollectionDataResponseSchema = z.object({
  price_range: ProductCollectionDataPriceRangeResponseSchema,
  attribute_counts: z.array(ProductCollectionDataAttributeCountsResponseSchema),
  rating_counts: z.array(ProductCollectionDataRatingCountsResponseSchema),
  taxonomy_counts: z.array(ProductCollectionDataTaxonomyCountsResponseSchema),
});

export type ProductCollectionDataResponse = z.infer<
  typeof ProductCollectionDataResponseSchema
>;
export class ApiProductCollectionDataResponse extends createZodDto(
  ProductCollectionDataResponseSchema
) {}
