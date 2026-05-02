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
const AnalyticsLinksSchema = z.record(z.string(), z.array(AnalyticsLinkSchema));

/**
 * Customer stats totals/subtotals shape
 */
export const AnalyticsCustomerStatsSchema = z.object({
  customers_count: z.number(),
  avg_orders_count: z.number(),
  avg_total_spend: z.number(),
  avg_avg_order_value: z.number(),
});
export type AnalyticsCustomerStats = z.infer<
  typeof AnalyticsCustomerStatsSchema
>;

/**
 * Single customer row from the customers detail endpoint
 */
export const AnalyticsCustomerSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  username: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  country: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  date_registered: z.string().nullable().optional(),
  date_registered_gmt: z.string().nullable().optional(),
  date_last_active: z.string().nullable().optional(),
  date_last_active_gmt: z.string().nullable().optional(),
  date_last_order: z.string().nullable().optional(),
  orders_count: z.number(),
  total_spend: z.number(),
  avg_order_value: z.number(),
  email: z.string().optional(),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsCustomer = z.infer<typeof AnalyticsCustomerSchema>;

/**
 * Query parameters for customers stats endpoint
 */
export const AnalyticsCustomersStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    search: z.string().optional(),
    searchby: z.enum(['name', 'username', 'email']).optional(),
    customers: z.array(z.number()).optional(),
  });
export type AnalyticsCustomersStatsQueryParams = z.infer<
  typeof AnalyticsCustomersStatsQueryParamsSchema
>;

/**
 * Query parameters for customers list (detail) endpoint
 */
export const AnalyticsCustomersListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    search: z.string().optional(),
    searchby: z.enum(['name', 'username', 'email']).optional(),
    customers: z.array(z.number()).optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    country: z.string().optional(),
  });
export type AnalyticsCustomersListQueryParams = z.infer<
  typeof AnalyticsCustomersListQueryParamsSchema
>;
