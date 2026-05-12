import { z } from 'zod';

export const ProductCollectionDataRequestSchema = z.looseObject({
  /**
   * Returns the min and max price for the product collection.
   * If false, only null will be returned.
   */
  calculate_price_range: z.boolean().optional(),
  /**
   * Returns attribute counts for a list of attribute taxonomies you pass in via this parameter.
   * Each should be provided as an object with keys "taxonomy" and "query_type".
   * If empty, null will be returned.
   */
  calculate_attribute_counts: z
    .array(
      z.looseObject({
        taxonomy: z.string(),
        query_type: z.string(),
      })
    )
    .optional(),
  /**
   * Returns the counts of products with a certain average rating, 1-5.
   * If false, only null will be returned.
   */
  calculate_rating_counts: z.boolean().optional(),
  /**
   * Returns counts of products with each stock status (in stock, out of stock, on backorder).
   * If false, only null will be returned.
   */
  calculate_stock_status_counts: z.boolean().optional(),
  /**
   * Returns taxonomy counts for a list of taxonomies you pass in via this parameter.
   * Each should be provided as a taxonomy name string.
   * If empty, null will be returned.
   */
  calculate_taxonomy_counts: z.array(z.string()).optional(),
});

export type ProductCollectionDataRequest = z.infer<
  typeof ProductCollectionDataRequestSchema
>;
