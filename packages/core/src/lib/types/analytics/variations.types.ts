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
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  interval: AnalyticsIntervalEnum.default('week')
    .optional()
    .describe('Time interval to use for buckets in the returned data.'),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
  fields: z
    .array(z.string())
    .optional()
    .describe('Limit stats fields to the specified items.'),
});

const AnalyticsListQueryParamsSchema = z.object({
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  orderby: z
    .string()
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Add additional piece of info about each variation to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(z.string(), z.array(AnalyticsLinkSchema));

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
  product_id: z.number().describe('Product ID.'),
  variation_id: z.number().describe('Product ID.'),
  items_sold: z.number().describe('Number of items sold.'),
  net_revenue: z.number().describe('Total Net sales of all items sold.'),
  orders_count: z.number().describe('Number of orders product appeared in.'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsVariation = z.infer<typeof AnalyticsVariationSchema>;

/**
 * Query parameters for variations stats endpoint
 */
export const AnalyticsVariationsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum([
        'coupons',
        'date',
        'items_sold',
        'net_revenue',
        'orders_count',
        'refunds',
        'shipping',
        'taxes',
      ])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
      ),
    variations: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified variation ids.'),
    attribute_is: z
      .array(z.array(z.unknown()))
      .default([])
      .optional()
      .describe(
        'Limit result set to orders that include products with the specified attributes.'
      ),
    attribute_is_not: z
      .array(z.array(z.unknown()))
      .default([])
      .optional()
      .describe(
        "Limit result set to orders that don't include products with the specified attributes."
      ),
    product_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified parent product(s)."
      ),
    product_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified parent product(s).'
      ),
    category_excludes: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to variations not in the specified categories.'
      ),
    category_includes: z
      .array(z.number())
      .optional()
      .describe('Limit result to items from the specified categories.'),
    segmentby: z
      .enum(['category', 'product', 'variation'])
      .optional()
      .describe('Segment the response by additional constraint.'),
  });
export type AnalyticsVariationsStatsQueryParams = z.infer<
  typeof AnalyticsVariationsStatsQueryParamsSchema
>;

/**
 * Query parameters for variations list (detail) endpoint
 */
export const AnalyticsVariationsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum(['date', 'items_sold', 'net_revenue', 'orders_count', 'sku'])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
      ),
    products: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified product ids.'),
    variations: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified variation ids.'),
    attribute_is: z
      .array(z.array(z.unknown()))
      .default([])
      .optional()
      .describe(
        'Limit result set to variations that include the specified attributes.'
      ),
    attribute_is_not: z
      .array(z.array(z.unknown()))
      .default([])
      .optional()
      .describe(
        "Limit result set to variations that don't include the specified attributes."
      ),
    category_excludes: z
      .array(z.number())
      .optional()
      .describe(
        'Limit result set to variations not in the specified categories.'
      ),
    category_includes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to variations in the specified categories.'),
    product_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified parent product(s)."
      ),
    product_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified parent product(s).'
      ),
  });
export type AnalyticsVariationsListQueryParams = z.infer<
  typeof AnalyticsVariationsListQueryParamsSchema
>;
