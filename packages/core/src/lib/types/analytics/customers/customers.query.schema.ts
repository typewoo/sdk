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
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  extended_info: z
    .boolean()
    .optional()
    .describe(
      'Add additional piece of info about each customer to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Query parameters for customers stats endpoint
 */
export const AnalyticsCustomersStatsQueryParamsSchema = z.object({
  match: z
    .enum(['all', 'any'])
    .default('all')
    .optional()
    .describe(
      'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
    ),
  search: z
    .string()
    .optional()
    .describe(
      'Limit response to objects with a customer field containing the search term. Searches the field provided by `searchby`.'
    ),
  searchby: z
    .enum(['all', 'email', 'name', 'username'])
    .default('name')
    .optional()
    .describe(
      'Limit results with `search` and `searchby` to specific fields containing the search term.'
    ),
  customers: z
    .array(z.number())
    .optional()
    .describe('Limit result to items with specified customer ids.'),
  customers_exclude: z
    .array(z.number())
    .optional()
    .describe('Limit result to exclude items with specified customer ids.'),
  name_includes: z
    .string()
    .optional()
    .describe('Limit response to objects with specific names.'),
  name_excludes: z
    .string()
    .optional()
    .describe('Limit response to objects excluding specific names.'),
  username_includes: z
    .string()
    .optional()
    .describe('Limit response to objects with specific usernames.'),
  username_excludes: z
    .string()
    .optional()
    .describe('Limit response to objects excluding specific usernames.'),
  email_includes: z
    .string()
    .optional()
    .describe('Limit response to objects including emails.'),
  email_excludes: z
    .string()
    .optional()
    .describe('Limit response to objects excluding emails.'),
  country_includes: z
    .string()
    .optional()
    .describe('Limit response to objects with specific countries.'),
  country_excludes: z
    .string()
    .optional()
    .describe('Limit response to objects excluding specific countries.'),
  registered_before: z
    .string()
    .optional()
    .describe(
      'Limit response to objects registered before (or at) a given ISO8601 compliant datetime.'
    ),
  registered_after: z
    .string()
    .optional()
    .describe(
      'Limit response to objects registered after (or at) a given ISO8601 compliant datetime.'
    ),
  registered_between: z
    .array(z.string())
    .optional()
    .describe(
      'Limit response to objects last active between two given ISO8601 compliant datetime.'
    ),
  last_active_before: z
    .string()
    .optional()
    .describe(
      'Limit response to objects last active before (or at) a given ISO8601 compliant datetime.'
    ),
  last_active_after: z
    .string()
    .optional()
    .describe(
      'Limit response to objects last active after (or at) a given ISO8601 compliant datetime.'
    ),
  last_active_between: z
    .array(z.string())
    .optional()
    .describe(
      'Limit response to objects last active between two given ISO8601 compliant datetime.'
    ),
  last_order_before: z
    .string()
    .optional()
    .describe(
      'Limit response to objects with last order before (or at) a given ISO8601 compliant datetime.'
    ),
  last_order_after: z
    .string()
    .optional()
    .describe(
      'Limit response to objects with last order after (or at) a given ISO8601 compliant datetime.'
    ),
  orders_count_min: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with an order count greater than or equal to given integer.'
    ),
  orders_count_max: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with an order count less than or equal to given integer.'
    ),
  orders_count_between: z
    .array(z.number())
    .optional()
    .describe(
      'Limit response to objects with an order count between two given integers.'
    ),
  total_spend_min: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with a total order spend greater than or equal to given number.'
    ),
  total_spend_max: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with a total order spend less than or equal to given number.'
    ),
  total_spend_between: z
    .array(z.number())
    .optional()
    .describe(
      'Limit response to objects with a total order spend between two given numbers.'
    ),
  avg_order_value_min: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with an average order spend greater than or equal to given number.'
    ),
  avg_order_value_max: z
    .number()
    .optional()
    .describe(
      'Limit response to objects with an average order spend less than or equal to given number.'
    ),
  avg_order_value_between: z
    .array(z.number())
    .optional()
    .describe(
      'Limit response to objects with an average order spend between two given numbers.'
    ),
  fields: z
    .array(z.string())
    .optional()
    .describe('Limit stats fields to the specified items.'),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});
export type AnalyticsCustomersStatsQueryParams = z.infer<
  typeof AnalyticsCustomersStatsQueryParamsSchema
>;

/**
 * Query parameters for customers list (detail) endpoint
 */
export const AnalyticsCustomersListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.omit({ extended_info: true }).extend({
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
      ),
    search: z
      .string()
      .optional()
      .describe(
        'Limit response to objects with a customer field containing the search term. Searches the field provided by `searchby`.'
      ),
    searchby: z
      .enum(['all', 'email', 'name', 'username'])
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
      .enum([
        'avg_order_value',
        'city',
        'country',
        'date_last_active',
        'date_registered',
        'email',
        'first_name',
        'last_name',
        'location',
        'name',
        'orders_count',
        'postcode',
        'state',
        'total_spend',
        'username',
      ])
      .default('date_registered')
      .optional()
      .describe('Sort collection by object attribute.'),
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    customers_exclude: z
      .array(z.number())
      .optional()
      .describe('Limit result to exclude items with specified customer ids.'),
    filter_empty: z
      .array(z.enum(['city', 'country', 'email', 'name', 'postcode', 'state']))
      .optional()
      .describe('Filter out results where any of the passed fields are empty'),
    last_active_after: z
      .string()
      .optional()
      .describe(
        'Limit response to objects last active after (or at) a given ISO8601 compliant datetime.'
      ),
    last_active_before: z
      .string()
      .optional()
      .describe(
        'Limit response to objects last active before (or at) a given ISO8601 compliant datetime.'
      ),
    last_active_between: z
      .array(z.string())
      .optional()
      .describe(
        'Limit response to objects last active between two given ISO8601 compliant datetime.'
      ),
    last_order_after: z
      .string()
      .optional()
      .describe(
        'Limit response to objects with last order after (or at) a given ISO8601 compliant datetime.'
      ),
    last_order_before: z
      .string()
      .optional()
      .describe(
        'Limit response to objects with last order before (or at) a given ISO8601 compliant datetime.'
      ),
    location_excludes: z
      .string()
      .optional()
      .describe(
        'Excludes customers by location (state, country). Provide a comma-separated list of locations. Each location can be a country code (e.g. GB) or combination of country and state (e.g. US:CA).'
      ),
    location_includes: z
      .string()
      .optional()
      .describe(
        'Includes customers by location (state, country). Provide a comma-separated list of locations. Each location can be a country code (e.g. GB) or combination of country and state (e.g. US:CA).'
      ),
    name_includes: z
      .string()
      .optional()
      .describe('Limit response to objects with specific names.'),
    name_excludes: z
      .string()
      .optional()
      .describe('Limit response to objects excluding specific names.'),
    email_includes: z
      .string()
      .optional()
      .describe('Limit response to objects including emails.'),
    email_excludes: z
      .string()
      .optional()
      .describe('Limit response to objects excluding emails.'),
    country_includes: z
      .string()
      .optional()
      .describe('Limit response to objects with specific countries.'),
    country_excludes: z
      .string()
      .optional()
      .describe('Limit response to objects excluding specific countries.'),
    orders_count_between: z
      .array(z.number())
      .optional()
      .describe(
        'Limit response to objects with an order count between two given integers.'
      ),
    orders_count_max: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with an order count less than or equal to given integer.'
      ),
    orders_count_min: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with an order count greater than or equal to given integer.'
      ),
    registered_after: z
      .string()
      .optional()
      .describe(
        'Limit response to objects registered after (or at) a given ISO8601 compliant datetime.'
      ),
    registered_before: z
      .string()
      .optional()
      .describe(
        'Limit response to objects registered before (or at) a given ISO8601 compliant datetime.'
      ),
    registered_between: z
      .array(z.string())
      .optional()
      .describe(
        'Limit response to objects last active between two given ISO8601 compliant datetime.'
      ),
    total_spend_between: z
      .array(z.number())
      .optional()
      .describe(
        'Limit response to objects with a total order spend between two given numbers.'
      ),
    total_spend_max: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with a total order spend less than or equal to given number.'
      ),
    total_spend_min: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with a total order spend greater than or equal to given number.'
      ),
    avg_order_value_between: z
      .array(z.number())
      .optional()
      .describe(
        'Limit response to objects with an average order spend between two given numbers.'
      ),
    avg_order_value_max: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with an average order spend less than or equal to given number.'
      ),
    avg_order_value_min: z
      .number()
      .optional()
      .describe(
        'Limit response to objects with an average order spend greater than or equal to given number.'
      ),
    user_type: z
      .enum(['all', 'guest', 'registered'])
      .default('all')
      .optional()
      .describe('Limit result to items with specified user type.'),
    username_excludes: z
      .string()
      .optional()
      .describe('Limit response to objects excluding specific usernames.'),
    username_includes: z
      .string()
      .optional()
      .describe('Limit response to objects with specific usernames.'),
    users: z
      .array(z.number())
      .optional()
      .describe('Limit result to items with specified user ids.'),
  });
export type AnalyticsCustomersListQueryParams = z.infer<
  typeof AnalyticsCustomersListQueryParamsSchema
>;
