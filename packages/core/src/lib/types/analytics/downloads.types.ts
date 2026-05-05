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
    .optional()
    .describe(
      'Add additional piece of info about each category to the report.'
    ),
  force_cache_refresh: z
    .boolean()
    .optional()
    .describe('Force retrieval of fresh data instead of from the cache.'),
});

/**
 * Download stats totals/subtotals shape
 */
export const AnalyticsDownloadStatsSchema = z.object({
  download_count: z.number(),
});
export type AnalyticsDownloadStats = z.infer<
  typeof AnalyticsDownloadStatsSchema
>;

export const AnalyticsDownloadIntervalSchema = z.looseObject({
  interval: z.string(),
  date_start: z.string(),
  date_start_gmt: z.string(),
  date_end: z.string(),
  date_end_gmt: z.string(),
  subtotals: AnalyticsDownloadStatsSchema,
});
export type AnalyticsDownloadInterval = z.infer<
  typeof AnalyticsDownloadIntervalSchema
>;

/**
 * Single download row from the downloads detail endpoint
 */
export const AnalyticsDownloadSchema = z.looseObject({
  id: z.number().optional().describe('ID.'),
  download_id: z.string().optional().describe('Download ID.'),
  product_id: z.number().describe('Product ID.'),
  date: z
    .string()
    .describe("The date of the download, in the site's timezone."),
  date_gmt: z.string().optional().describe('The date of the download, as GMT.'),
  order_id: z.number().describe('Order ID.'),
  order_number: z.string().optional().describe('Order Number.'),
  user_id: z.number().describe('User ID for the downloader.'),
  username: z.string().optional().describe('User name of the downloader.'),
  ip_address: z.string().optional().describe('IP address for the downloader.'),
  file_name: z.string().optional().describe('File name.'),
  file_path: z.string().optional().describe('File URL.'),
});
export type AnalyticsDownload = z.infer<typeof AnalyticsDownloadSchema>;

/**
 * Query parameters for downloads stats endpoint
 */
export const AnalyticsDownloadsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: status_is, status_is_not, product_includes, product_excludes, coupon_includes, coupon_excludes, customer, categories'
      ),
    orderby: z
      .enum(['date', 'download_count'])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
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
    order_includes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items that have the specified order ids.'),
    order_excludes: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order ids."
      ),
    ip_address_includes: z
      .array(z.string())
      .optional()
      .describe('Limit response to objects that have a specified ip address.'),
    ip_address_excludes: z
      .array(z.string())
      .optional()
      .describe(
        "Limit response to objects that don't have a specified ip address."
      ),
    customer_includes: z
      .array(z.number())
      .optional()
      .describe(
        'Limit response to objects that have the specified customer ids.'
      ),
    customer_excludes: z
      .array(z.number())
      .optional()
      .describe(
        "Limit response to objects that don't have the specified customer ids."
      ),
  });
export type AnalyticsDownloadsStatsQueryParams = z.infer<
  typeof AnalyticsDownloadsStatsQueryParamsSchema
>;

/**
 * Query parameters for downloads list (detail) endpoint
 */
export const AnalyticsDownloadsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.omit({ extended_info: true }).extend({
    context: z
      .enum(['edit', 'view'])
      .default('view')
      .optional()
      .describe(
        'Scope under which the request is made; determines fields present in response.'
      ),
    match: z
      .enum(['all', 'any'])
      .default('all')
      .optional()
      .describe(
        'Indicates whether all the conditions should be true for the resulting set, or if any one of them is sufficient. Match affects the following parameters: products, orders, username, ip_address.'
      ),
    orderby: z
      .enum(['date', 'product'])
      .default('date')
      .optional()
      .describe('Sort collection by object attribute.'),
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
    order_includes: z
      .array(z.number())
      .optional()
      .describe('Limit result set to items that have the specified order ids.'),
    order_excludes: z
      .array(z.number())
      .optional()
      .describe(
        "Limit result set to items that don't have the specified order ids."
      ),
    ip_address_includes: z
      .array(z.string())
      .optional()
      .describe('Limit response to objects that have a specified ip address.'),
    ip_address_excludes: z
      .array(z.string())
      .optional()
      .describe(
        "Limit response to objects that don't have a specified ip address."
      ),
    customer_includes: z
      .array(z.number())
      .optional()
      .describe('Limit response to objects that have the specified user ids.'),
    customer_excludes: z
      .array(z.number())
      .optional()
      .describe(
        "Limit response to objects that don't have the specified user ids."
      ),
  });
export type AnalyticsDownloadsListQueryParams = z.infer<
  typeof AnalyticsDownloadsListQueryParamsSchema
>;
