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

/**
 * Download stats totals/subtotals shape
 */
export const AnalyticsDownloadStatsSchema = z.object({
  download_count: z.number(),
});
export type AnalyticsDownloadStats = z.infer<
  typeof AnalyticsDownloadStatsSchema
>;

/**
 * Single download row from the downloads detail endpoint
 */
export const AnalyticsDownloadSchema = z.object({
  download_id: z.number().optional(),
  product_id: z.number(),
  date: z.string(),
  date_gmt: z.string().optional(),
  order_id: z.number(),
  order_number: z.string().optional(),
  user_id: z.number(),
  ip_address: z.string().optional(),
  file_name: z.string().optional(),
  file_path: z.string().optional(),
});
export type AnalyticsDownload = z.infer<typeof AnalyticsDownloadSchema>;

/**
 * Query parameters for downloads stats endpoint
 */
export const AnalyticsDownloadsStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    product_includes: z.array(z.number()).optional(),
    product_excludes: z.array(z.number()).optional(),
    order_includes: z.array(z.number()).optional(),
    order_excludes: z.array(z.number()).optional(),
    ip_address_includes: z.array(z.string()).optional(),
    ip_address_excludes: z.array(z.string()).optional(),
    customer_includes: z.array(z.number()).optional(),
    customer_excludes: z.array(z.number()).optional(),
  });
export type AnalyticsDownloadsStatsQueryParams = z.infer<
  typeof AnalyticsDownloadsStatsQueryParamsSchema
>;

/**
 * Query parameters for downloads list (detail) endpoint
 */
export const AnalyticsDownloadsListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    product_includes: z.array(z.number()).optional(),
    product_excludes: z.array(z.number()).optional(),
    order_includes: z.array(z.number()).optional(),
    order_excludes: z.array(z.number()).optional(),
    ip_address_includes: z.array(z.string()).optional(),
    ip_address_excludes: z.array(z.string()).optional(),
    customer_includes: z.array(z.number()).optional(),
    customer_excludes: z.array(z.number()).optional(),
  });
export type AnalyticsDownloadsListQueryParams = z.infer<
  typeof AnalyticsDownloadsListQueryParamsSchema
>;
