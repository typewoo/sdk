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
 * Order stats totals/subtotals shape
 */
export const AnalyticsOrderStatsSchema = z.object({
  orders_count: z.number(),
  num_items_sold: z.number(),
  gross_sales: z.number(),
  total_sales: z.number(),
  coupons: z.number(),
  coupons_count: z.number(),
  refunds: z.number(),
  taxes: z.number(),
  shipping: z.number(),
  net_revenue: z.number(),
  avg_items_per_order: z.number(),
  avg_order_value: z.number(),
  total_customers: z.number(),
  products: z.number().optional(),
});
export type AnalyticsOrderStats = z.infer<typeof AnalyticsOrderStatsSchema>;

export const AnalyticsOrderIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsOrderStatsSchema,
});
export type AnalyticsOrderInterval = z.infer<
  typeof AnalyticsOrderIntervalSchema
>;

/**
 * Extended info for an order detail row
 */
export const AnalyticsOrderExtendedInfoSchema = z.object({
  products: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number(),
      })
    )
    .optional(),
  coupons: z
    .array(
      z.object({
        id: z.number(),
        code: z.string(),
      })
    )
    .optional(),
  customer: z
    .object({
      customer_id: z.number().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  attribution: z.looseObject({}).optional(),
});
export type AnalyticsOrderExtendedInfo = z.infer<
  typeof AnalyticsOrderExtendedInfoSchema
>;

/**
 * Single order row from the orders detail endpoint
 */
export const AnalyticsOrderSchema = z.looseObject({
  order_id: z.number().describe('Order ID.'),
  order_number: z
    .union([z.string(), z.number()])
    .optional()
    .describe('Order Number.'),
  date_created: z
    .string()
    .describe("Date the order was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .optional()
    .describe('Date the order was created, as GMT.'),
  status: z.string().describe('Order status.'),
  customer_id: z.number().describe('Customer ID.'),
  net_total: z.number().describe('Net total revenue.'),
  num_items_sold: z.number().describe('Number of items sold.'),
  customer_type: z.string().optional().describe('Returning or new customer.'),
  total_formatted: z
    .string()
    .optional()
    .describe('Net total revenue (formatted).'),
  extended_info: z.record(z.string(), z.unknown()).optional(),
});
export type AnalyticsOrder = z.infer<typeof AnalyticsOrderSchema>;

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
