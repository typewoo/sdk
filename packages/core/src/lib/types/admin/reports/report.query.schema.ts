import { z } from 'zod';

export const AdminReportsQueryParamsSchema = z.looseObject({
  context: z.enum(['view']).optional(),
  period: z.enum(['week', 'month', 'last_month', 'year']).optional(),
  date_min: z.string().optional(),
  date_max: z.string().optional(),
  force_cache_refresh: z.boolean().optional(),
});

export type AdminReportsQueryParams = z.infer<
  typeof AdminReportsQueryParamsSchema
>;

export const AdminSalesReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    interval: z.enum(['day', 'week', 'month', 'year']).optional(),
  });

export type AdminSalesReportQueryParams = z.infer<
  typeof AdminSalesReportQueryParamsSchema
>;

export const AdminTopSellersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    per_page: z.number().optional(),
    page: z.number().optional(),
  });

export type AdminTopSellersReportQueryParams = z.infer<
  typeof AdminTopSellersReportQueryParamsSchema
>;

export const AdminCustomersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    registered_before: z.string().optional(),
    registered_after: z.string().optional(),
    orders_count_min: z.number().optional(),
    orders_count_max: z.number().optional(),
    total_spend_min: z.string().optional(),
    total_spend_max: z.string().optional(),
    avg_order_value_min: z.string().optional(),
    avg_order_value_max: z.string().optional(),
    last_active_before: z.string().optional(),
    last_active_after: z.string().optional(),
    per_page: z.number().optional(),
    page: z.number().optional(),
  });

export type AdminCustomersReportQueryParams = z.infer<
  typeof AdminCustomersReportQueryParamsSchema
>;

export const AdminOrdersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    status: z.array(z.string()).optional(),
    product: z.array(z.number()).optional(),
    variation: z.array(z.number()).optional(),
    category: z.array(z.number()).optional(),
    coupon: z.array(z.number()).optional(),
    customer: z.array(z.number()).optional(),
  });

export type AdminOrdersReportQueryParams = z.infer<
  typeof AdminOrdersReportQueryParamsSchema
>;
