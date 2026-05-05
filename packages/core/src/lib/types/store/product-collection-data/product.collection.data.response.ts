import { z } from 'zod';
import { ProductCollectionDataAttributeCountsResponseSchema } from './product.collection.data.attribute.counts.response.js';
import { ProductCollectionDataPriceRangeResponseSchema } from './product.collection.data.price.range.response.js';
import { ProductCollectionDataRatingCountsResponseSchema } from './product.collection.data.rating.counts.response.js';
import { ProductCollectionDataTaxonomyCountsResponseSchema } from './product.collection.data.taxonomy.counts.response.js';

export const ProductCollectionDataResponseSchema = z.looseObject({
  price_range: ProductCollectionDataPriceRangeResponseSchema.nullable()
    .optional()
    .describe(
      'Min and max prices found in collection of products, provided using the smallest unit of the currency.'
    ),
  attribute_counts: z
    .array(ProductCollectionDataAttributeCountsResponseSchema)
    .nullable()
    .describe('Returns number of products within attribute terms.'),
  rating_counts: z
    .array(ProductCollectionDataRatingCountsResponseSchema)
    .nullable()
    .describe('Returns number of products with each average rating.'),
  taxonomy_counts: z
    .array(ProductCollectionDataTaxonomyCountsResponseSchema)
    .nullable()
    .describe('Returns number of products within taxonomy terms.'),
  stock_status_counts: z
    .array(z.record(z.string(), z.unknown()))
    .nullable()
    .optional()
    .describe('Returns number of products with each stock status.'),
});

export type ProductCollectionDataResponse = z.infer<
  typeof ProductCollectionDataResponseSchema
>;
