import { z } from 'zod';
import {
  ProductRequestSchema,
  type ProductUnstableTaxonomyFilter,
} from '../product/product.query.schema.js';

/**
 * Query for `GET /products/collection-data`. Accepts every products filter,
 * so the counts describe the same collection a products query would return,
 * plus flags choosing which aggregates to calculate.
 */
export const ProductCollectionDataRequestSchema = ProductRequestSchema.extend({
  // Unlike the products list, collection data has no `embed` context.
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  /**
   * Returns the min and max price for the product collection.
   * If false, only null will be returned.
   */
  calculate_price_range: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, calculates the minimum and maximum product prices for the collection.'
    ),
  /**
   * Returns attribute counts for a list of attribute taxonomies you pass in
   * via this parameter, each as `{ taxonomy, query_type }`.
   * If empty, null will be returned.
   */
  calculate_attribute_counts: z
    .array(
      z.looseObject({
        taxonomy: z.string(),
        query_type: z.string(),
      })
    )
    .default([])
    .optional()
    .describe(
      'If requested, calculates attribute term counts for products in the collection.'
    ),
  /**
   * Returns the counts of products with a certain average rating, 1-5.
   * If false, only null will be returned.
   */
  calculate_rating_counts: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, calculates rating counts for products in the collection.'
    ),
  /**
   * Returns counts of products with each stock status.
   * If false, only null will be returned.
   */
  calculate_stock_status_counts: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, calculates stock counts for products in the collection.'
    ),
  /**
   * Returns taxonomy counts for a list of taxonomy names.
   * If empty, null will be returned.
   */
  calculate_taxonomy_counts: z
    .array(z.string())
    .default([])
    .optional()
    .describe(
      'If requested, calculates taxonomy term counts for products in the collection.'
    ),
});

export type ProductCollectionDataRequest = z.input<
  typeof ProductCollectionDataRequestSchema
> &
  ProductUnstableTaxonomyFilter;
