import { z } from 'zod';

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
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .optional()
    .describe(
      'Add additional piece of info about each category to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

const AnalyticsLinkSchema = z.object({ href: z.string() });
const AnalyticsLinksSchema = z.record(z.string(), z.array(AnalyticsLinkSchema));

/**
 * A single performance indicator value
 */
export const AnalyticsPerformanceIndicatorSchema = z.object({
  stat: z
    .enum([
      'coupons/amount',
      'coupons/orders_count',
      'downloads/download_count',
      'orders/avg_order_value',
      'orders/orders_count',
      'products/items_sold',
      'revenue/gross_sales',
      'revenue/net_revenue',
      'revenue/refunds',
      'revenue/shipping',
      'revenue/total_sales',
      'taxes/order_tax',
      'taxes/shipping_tax',
      'taxes/total_tax',
      'variations/items_sold',
    ])
    .describe('Unique identifier for the resource.'),
  chart: z.string().describe('The specific chart this stat referrers to.'),
  label: z.string().optional().describe('Human readable label for the stat.'),
  format: z
    .enum(['currency', 'number'])
    .optional()
    .describe('Format of the stat.'),
  value: z
    .union([z.number(), z.string()])
    .optional()
    .describe(
      'Value of the stat. Returns null if the stat does not exist or cannot be loaded.'
    ),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsPerformanceIndicator = z.infer<
  typeof AnalyticsPerformanceIndicatorSchema
>;

/**
 * Allowed indicator descriptor
 */
export const AnalyticsPerformanceAllowedSchema = z.object({
  stat: z
    .enum([
      'coupons/amount',
      'coupons/orders_count',
      'downloads/download_count',
      'orders/avg_order_value',
      'orders/orders_count',
      'products/items_sold',
      'revenue/gross_sales',
      'revenue/net_revenue',
      'revenue/refunds',
      'revenue/shipping',
      'revenue/total_sales',
      'taxes/order_tax',
      'taxes/shipping_tax',
      'taxes/total_tax',
      'variations/items_sold',
    ])
    .describe('Unique identifier for the resource.'),
  chart: z.string().describe('The specific chart this stat referrers to.'),
  label: z.string().describe('Human readable label for the stat.'),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsPerformanceAllowed = z.infer<
  typeof AnalyticsPerformanceAllowedSchema
>;

/**
 * Query parameters for performance indicators endpoint
 */
export const AnalyticsPerformanceQueryParamsSchema = z.object({
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  stats: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Limit response to specific report stats. Allowed values: .'),
});
export type AnalyticsPerformanceQueryParams = z.infer<
  typeof AnalyticsPerformanceQueryParamsSchema
>;
