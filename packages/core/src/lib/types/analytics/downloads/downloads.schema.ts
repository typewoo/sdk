import { z } from 'zod';

/**
 * Download stats totals/subtotals shape
 */
export const AnalyticsDownloadStatsSchema = z.looseObject({
  download_count: z.number().describe('Number of downloads.'),
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

export const AnalyticsDownloadsStatsResponseSchema = z.looseObject({
  totals: AnalyticsDownloadStatsSchema.describe('Totals data.'),
  intervals: z
    .array(AnalyticsDownloadIntervalSchema)
    .optional()
    .describe('Reports data grouped by intervals.'),
});
export type AnalyticsDownloadsStatsResponse = z.infer<
  typeof AnalyticsDownloadsStatsResponseSchema
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
