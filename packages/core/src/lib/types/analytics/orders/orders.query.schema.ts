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
    .describe('Add additional piece of info about each coupon to the report.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Query parameters for orders stats endpoint
 */
export const AnalyticsOrdersStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.omit({ fields: true }).extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum(['avg_order_value', 'date', 'net_revenue', 'orders_count'])
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
    status_is: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        'Limit result set to items that have the specified order status.'
      ),
    status_is_not: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order status."
      ),
    product_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified product(s) assigned.'
      ),
    product_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified product(s) assigned."
      ),
    variation_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified variation(s) assigned.'
      ),
    variation_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified variation(s) assigned."
      ),
    coupon_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified coupon(s) assigned.'
      ),
    coupon_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified coupon(s) assigned."
      ),
    tax_rate_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified tax rate(s) assigned.'
      ),
    tax_rate_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified tax rate(s) assigned."
      ),
    customer_type: z
      .enum(['new', 'returning'])
      .optional()
      .describe(
        'Limit result set to orders that have the specified customer_type'
      ),
    refunds: z
      .enum(['', 'all', 'partial', 'full', 'none'])
      .default('')
      .optional()
      .describe('Limit result set to specific types of refunds.'),
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
    segmentby: z
      .enum(['product', 'category', 'variation', 'coupon', 'customer_type'])
      .optional()
      .describe('Segment the response by additional constraint.'),
    customer: z
      .enum(['new', 'returning'])
      .optional()
      .describe('Alias for customer_type (deprecated).'),
  });
export type AnalyticsOrdersStatsQueryParams = z.infer<
  typeof AnalyticsOrdersStatsQueryParamsSchema
>;

/**
 * Query parameters for orders list (detail) endpoint
 */
export const AnalyticsOrdersListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    orderby: z
      .enum(['date', 'net_total', 'num_items_sold'])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
    status_is: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        'Limit result set to items that have the specified order status.'
      ),
    status_is_not: z
      .array(
        z.enum([
          'any',
          'cancelled',
          'checkout-draft',
          'completed',
          'failed',
          'on-hold',
          'pending',
          'processing',
          'refunded',
          'trash',
        ])
      )
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order status."
      ),
    product_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified product(s) assigned.'
      ),
    product_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified product(s) assigned."
      ),
    coupon_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified coupon(s) assigned.'
      ),
    coupon_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified coupon(s) assigned."
      ),
    customer_type: z
      .enum(['', 'new', 'returning'])
      .default('')
      .optional()
      .describe('Limit result set to returning or new customers.'),
    refunds: z
      .enum(['', 'all', 'partial', 'full', 'none'])
      .default('')
      .optional()
      .describe('Limit result set to specific types of refunds.'),
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
    order_excludes: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order ids."
      ),
    order_includes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items that have the specified order ids.'),
    tax_rate_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified tax rate(s) assigned."
      ),
    tax_rate_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified tax rate(s) assigned.'
      ),
    variation_excludes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        "Limit result set to items that don't have the specified variation(s) assigned."
      ),
    variation_includes: z
      .array(z.number())
      .default([])
      .optional()
      .describe(
        'Limit result set to items that have the specified variation(s) assigned.'
      ),
  });
export type AnalyticsOrdersListQueryParams = z.infer<
  typeof AnalyticsOrdersListQueryParamsSchema
>;
