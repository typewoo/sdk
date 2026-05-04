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
  interval: AnalyticsIntervalEnum.optional().describe(
    'Time interval to use for buckets in the returned data.'
  ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
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
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
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
  orders_count: z.number().describe('Number of orders.'),
  total_spend: z.number().describe('Total spend.'),
  avg_order_value: z.number().describe('Avg order value.'),
  email: z.string().optional().describe('Email address.'),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsCustomer = z.infer<typeof AnalyticsCustomerSchema>;

/**
 * Query parameters for customers stats endpoint
 */
export const AnalyticsCustomersStatsQueryParamsSchema = z.object({
  match: z
    .enum(['all', 'any'])
    .default('all')
    .optional()
    .describe(
      'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient.'
    ),
  search: z
    .string()
    .optional()
    .describe(
      'Limit response to objects with a customer field containing the search term.'
    ),
  searchby: z
    .enum(['name', 'username', 'email'])
    .default('name')
    .optional()
    .describe(
      'Limit results with `search` and `searchby` to specific fields containing the search term.'
    ),
  customers: z
    .array(z.number())
    .optional()
    .describe('Limit result to items with specified customer ids.'),
  customers_exclude: z.array(z.number()).optional(),
  name_includes: z.string().optional(),
  name_excludes: z.string().optional(),
  username_includes: z.string().optional(),
  username_excludes: z.string().optional(),
  email_includes: z.string().optional(),
  email_excludes: z.string().optional(),
  country_includes: z.string().optional(),
  country_excludes: z.string().optional(),
  registered_before: z.string().optional(),
  registered_after: z.string().optional(),
  registered_between: z.string().optional(),
  last_active_before: z.string().optional(),
  last_active_after: z.string().optional(),
  last_active_between: z.string().optional(),
  last_order_before: z.string().optional(),
  last_order_after: z.string().optional(),
  orders_count_min: z.number().optional(),
  orders_count_max: z.number().optional(),
  orders_count_between: z.string().optional(),
  total_spend_min: z.number().optional(),
  total_spend_max: z.number().optional(),
  total_spend_between: z.string().optional(),
  avg_order_value_min: z.number().optional(),
  avg_order_value_max: z.number().optional(),
  avg_order_value_between: z.string().optional(),
  fields: z.array(z.string()).optional(),
  force_cache_refresh: z.boolean().optional(),
  context: z.string().optional(),
});
export type AnalyticsCustomersStatsQueryParams = z.infer<
  typeof AnalyticsCustomersStatsQueryParamsSchema
>;

/**
 * Query parameters for customers list (detail) endpoint
 */
export const AnalyticsCustomersListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient.'
      ),
    search: z
      .string()
      .optional()
      .describe(
        'Limit response to objects with a customer field containing the search term.'
      ),
    searchby: z
      .enum(['name', 'username', 'email'])
      .default('name')
      .optional()
      .describe(
        'Limit results with `search` and `searchby` to specific fields containing the search term.'
      ),
    customers: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified customer ids.'),
    orderby: z
      .string()
      .default('date_registered')
      .optional()
      .describe('Sort collection by object attribute.'),
    name_includes: z.string().optional(),
    name_excludes: z.string().optional(),
    email_includes: z.string().optional(),
    email_excludes: z.string().optional(),
    country_includes: z.string().optional(),
    country_excludes: z.string().optional(),
  });
export type AnalyticsCustomersListQueryParams = z.infer<
  typeof AnalyticsCustomersListQueryParamsSchema
>;
