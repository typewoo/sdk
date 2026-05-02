import { z } from 'zod';

const AnalyticsIntervalEnum = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

const AnalyticsStatsQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  interval: AnalyticsIntervalEnum.optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  force_cache_refresh: z.boolean().optional(),
  fields: z.array(z.string()).optional(),
});

const AnalyticsListQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  extended_info: z.boolean().optional(),
  force_cache_refresh: z.boolean().optional(),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(
  z.string(),
  z.array(AnalyticsLinkSchema)
);

/**
 * Variation stats totals/subtotals shape
 */
export const AnalyticsVariationStatsSchema = z.object({
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  variations_count: z.number().optional(),
});
export type AnalyticsVariationStats = z.infer<
  typeof AnalyticsVariationStatsSchema
>;

/**
 * Extended info for a variation detail row
 */
export const AnalyticsVariationExtendedInfoSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  permalink: z.string().optional(),
  price: z.number().optional(),
  sku: z.string().optional(),
  stock_status: z.string().optional(),
  stock_quantity: z.number().nullable().optional(),
  low_stock_amount: z.number().nullable().optional(),
  attributes: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        option: z.string(),
      })
    )
    .optional(),
});
export type AnalyticsVariationExtendedInfo = z.infer<
  typeof AnalyticsVariationExtendedInfoSchema
>;

/**
 * Single variation row from the variations detail endpoint
 */
export const AnalyticsVariationSchema = z.object({
  product_id: z.number(),
  variation_id: z.number(),
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  extended_info: AnalyticsVariationExtendedInfoSchema.optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsVariation = z.infer<typeof AnalyticsVariationSchema>;

/**
 * Query parameters for variations stats endpoint
 */
export const AnalyticsVariationsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    products: z.array(z.number()).optional(),
    variations: z.array(z.number()).optional(),
    categories: z.array(z.number()).optional(),
  });
export type AnalyticsVariationsStatsQueryParams = z.infer<
  typeof AnalyticsVariationsStatsQueryParamsSchema
>;

/**
 * Query parameters for variations list (detail) endpoint
 */
export const AnalyticsVariationsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    products: z.array(z.number()).optional(),
    variations: z.array(z.number()).optional(),
  });
export type AnalyticsVariationsListQueryParams = z.infer<
  typeof AnalyticsVariationsListQueryParamsSchema
>;
