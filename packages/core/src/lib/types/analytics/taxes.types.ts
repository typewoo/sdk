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
 * Tax stats totals/subtotals shape
 */
export const AnalyticsTaxStatsSchema = z.object({
  tax_codes: z.number().optional(),
  total_tax: z.number(),
  order_tax: z.number(),
  shipping_tax: z.number(),
  orders_count: z.number(),
});
export type AnalyticsTaxStats = z.infer<typeof AnalyticsTaxStatsSchema>;

/**
 * Extended info for a tax detail row
 */
export const AnalyticsTaxExtendedInfoSchema = z.object({
  name: z.string().optional(),
  rate: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  priority: z.number().optional(),
});
export type AnalyticsTaxExtendedInfo = z.infer<
  typeof AnalyticsTaxExtendedInfoSchema
>;

/**
 * Single tax row from the taxes detail endpoint
 */
export const AnalyticsTaxSchema = z.object({
  tax_rate_id: z.number().describe('Tax rate ID.'),
  name: z.string().describe('Name.'),
  tax_rate: z.number().describe('Tax rate.'),
  country: z.string().describe('Country code.'),
  state: z.string().describe('State code.'),
  priority: z.number().describe('Priority.'),
  total_tax: z.number().describe('Total tax.'),
  order_tax: z.number().describe('Order tax.'),
  shipping_tax: z.number().describe('Shipping tax.'),
  orders_count: z.number().describe('Number of orders.'),
  _links: AnalyticsLinksSchema.optional(),
});
export type AnalyticsTax = z.infer<typeof AnalyticsTaxSchema>;

/**
 * Query parameters for taxes stats endpoint
 */
export const AnalyticsTaxesStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    taxes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items assigned one or more tax rates.'),
  });
export type AnalyticsTaxesStatsQueryParams = z.infer<
  typeof AnalyticsTaxesStatsQueryParamsSchema
>;

/**
 * Query parameters for taxes list (detail) endpoint
 */
export const AnalyticsTaxesListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.omit({ extended_info: true }).extend({
    taxes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items assigned one or more tax rates.'),
    orderby: z
      .string()
      .default('tax_rate_id')
      .optional()
      .describe('Sort collection by object attribute.'),
  });
export type AnalyticsTaxesListQueryParams = z.infer<
  typeof AnalyticsTaxesListQueryParamsSchema
>;
