import { z } from 'zod';
import {
  AnalyticsStatsQueryParamsSchema,
  AnalyticsListQueryParamsSchema,
} from './common.types.js';

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
  country: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  date_registered: z.string().nullable().optional(),
  date_registered_gmt: z.string().nullable().optional(),
  date_last_active: z.string().nullable().optional(),
  date_last_active_gmt: z.string().nullable().optional(),
  orders_count: z.number(),
  total_spend: z.number(),
  avg_order_value: z.number(),
  email: z.string().optional(),
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
