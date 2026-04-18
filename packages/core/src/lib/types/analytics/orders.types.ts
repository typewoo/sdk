import { z } from 'zod';
import {
  AnalyticsStatsQueryParamsSchema,
  AnalyticsListQueryParamsSchema,
  AnalyticsLinksSchema,
} from './common.types.js';

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
});
export type AnalyticsOrderExtendedInfo = z.infer<
  typeof AnalyticsOrderExtendedInfoSchema
>;

/**
 * Single order row from the orders detail endpoint
 */
export const AnalyticsOrderSchema = z.object({
  order_id: z.number(),
  parent_id: z.number().optional(),
  date: z.string().optional(),
  order_number: z.union([z.string(), z.number()]).optional(),
  date_created: z.string(),
  date_created_gmt: z.string().optional(),
  status: z.string(),
  customer_id: z.number(),
  net_total: z.number(),
  total_sales: z.number().optional(),
  num_items_sold: z.number(),
  customer_type: z.string().optional(),
  total_formatted: z.string().optional(),
  extended_info: AnalyticsOrderExtendedInfoSchema.optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsOrder = z.infer<typeof AnalyticsOrderSchema>;

/**
 * Query parameters for orders stats endpoint
 */
export const AnalyticsOrdersStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    status_is: z.array(z.string()).optional(),
    status_is_not: z.array(z.string()).optional(),
    product_includes: z.array(z.number()).optional(),
    product_excludes: z.array(z.number()).optional(),
    variation_includes: z.array(z.number()).optional(),
    variation_excludes: z.array(z.number()).optional(),
    coupon_includes: z.array(z.number()).optional(),
    coupon_excludes: z.array(z.number()).optional(),
    tax_rate_includes: z.array(z.number()).optional(),
    tax_rate_excludes: z.array(z.number()).optional(),
    customer_type: z.enum(['new', 'returning']).optional(),
    refunds: z.enum(['', 'all', 'partial', 'full', 'none']).optional(),
    attribute_is: z.array(z.array(z.unknown())).optional(),
    attribute_is_not: z.array(z.array(z.unknown())).optional(),
    segmentby: z
      .enum(['product', 'category', 'variation', 'coupon', 'customer_type'])
      .optional(),
    categories: z.array(z.number()).optional(),
  });
export type AnalyticsOrdersStatsQueryParams = z.infer<
  typeof AnalyticsOrdersStatsQueryParamsSchema
>;

/**
 * Query parameters for orders list (detail) endpoint
 */
export const AnalyticsOrdersListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    status_is: z.array(z.string()).optional(),
    status_is_not: z.array(z.string()).optional(),
    product_includes: z.array(z.number()).optional(),
    product_excludes: z.array(z.number()).optional(),
    coupon_includes: z.array(z.number()).optional(),
    coupon_excludes: z.array(z.number()).optional(),
    customer_type: z.enum(['new', 'returning']).optional(),
    refunds: z.enum(['', 'all', 'partial', 'full', 'none']).optional(),
  });
export type AnalyticsOrdersListQueryParams = z.infer<
  typeof AnalyticsOrdersListQueryParamsSchema
>;
