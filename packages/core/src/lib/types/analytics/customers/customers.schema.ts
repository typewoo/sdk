import { z } from 'zod';

/**
 * Customer stats totals/subtotals shape
 */
export const AnalyticsCustomerStatsSchema = z.looseObject({
  customers_count: z.number().describe('Number of customers.'),
  avg_orders_count: z.number().describe('Average number of orders.'),
  avg_total_spend: z.number().describe('Average total spend per customer.'),
  avg_avg_order_value: z.number().describe('Average AOV per customer.'),
});
export type AnalyticsCustomerStats = z.infer<
  typeof AnalyticsCustomerStatsSchema
>;

export const AnalyticsCustomersStatsResponseSchema = z.looseObject({
  totals: AnalyticsCustomerStatsSchema.describe('Totals data.'),
});
export type AnalyticsCustomersStatsResponse = z.infer<
  typeof AnalyticsCustomersStatsResponseSchema
>;

/**
 * Single customer row from the customers detail endpoint
 */
export const AnalyticsCustomerSchema = z.looseObject({
  id: z.number().describe('Customer ID.'),
  user_id: z.number().describe('User ID.'),
  name: z.string().describe('Name.'),
  username: z.string().describe('Username.'),
  first_name: z.string().optional().describe('First name.'),
  last_name: z.string().optional().describe('Last name.'),
  country: z.string().describe('Country / Region.'),
  city: z.string().describe('City.'),
  state: z.string().describe('Region.'),
  postcode: z.string().describe('Postal code.'),
  date_registered: z.string().optional().describe('Date registered.'),
  date_registered_gmt: z.string().optional().describe('Date registered GMT.'),
  date_last_active: z.string().optional().describe('Date last active.'),
  date_last_active_gmt: z.string().optional().describe('Date last active GMT.'),
  orders_count: z.number().describe('Order count.'),
  total_spend: z.number().describe('Total spend.'),
  avg_order_value: z.number().describe('Avg order value.'),
  email: z.string().optional().describe('Email address.'),
});
export type AnalyticsCustomer = z.infer<typeof AnalyticsCustomerSchema>;
