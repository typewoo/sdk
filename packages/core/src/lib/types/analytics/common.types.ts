import { z } from 'zod';

/**
 * Time interval options for analytics buckets
 */
export const AnalyticsIntervalEnum = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);
export type AnalyticsIntervalType = z.infer<typeof AnalyticsIntervalEnum>;

/**
 * Common query parameters shared across all analytics stats endpoints
 */
export const AnalyticsStatsQueryParamsSchema = z.object({
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
export type AnalyticsStatsQueryParams = z.infer<
  typeof AnalyticsStatsQueryParamsSchema
>;

/**
 * Common query parameters shared across analytics list (detail) endpoints
 */
export const AnalyticsListQueryParamsSchema = z.object({
  before: z.string().optional(),
  after: z.string().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  extended_info: z.boolean().optional(),
  force_cache_refresh: z.boolean().optional(),
});
export type AnalyticsListQueryParams = z.infer<
  typeof AnalyticsListQueryParamsSchema
>;

/**
 * Segment within a stats response (used when segmentby is applied)
 */
export const AnalyticsSegmentSchema = z.object({
  segment_id: z.number(),
  segment_label: z.string().optional(),
  subtotals: z.record(z.string(), z.unknown()),
});
export type AnalyticsSegment = z.infer<typeof AnalyticsSegmentSchema>;

export const AnalyticsLinkSchema = z.object({
  href: z.string(),
});
export type AnalyticsLink = z.infer<typeof AnalyticsLinkSchema>;

export const AnalyticsLinksSchema = z.record(
  z.string(),
  z.array(AnalyticsLinkSchema)
);
export type AnalyticsLinks = z.infer<typeof AnalyticsLinksSchema>;

export type AnalyticsSegmentedTotals<T> = T & {
  segments?: AnalyticsSegment[];
};

export interface AnalyticsTotalsResponse<T> {
  totals: T;
}

/**
 * A single time interval in a stats response
 */
export interface AnalyticsStatsInterval<T> {
  interval: string;
  date_start: string;
  date_start_gmt: string;
  date_end: string;
  date_end_gmt: string;
  subtotals: AnalyticsSegmentedTotals<T>;
}

/**
 * Top-level shape returned by all /stats endpoints
 */
export interface AnalyticsStatsResponse<T>
  extends AnalyticsTotalsResponse<AnalyticsSegmentedTotals<T>> {
  intervals?: AnalyticsStatsInterval<T>[];
}
