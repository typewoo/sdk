/**
 * Segment within a stats response (used when segmentby is applied)
 *
 * @deprecated Deprecated in 4.0 and will be removed in 5.0. Use the per-report
 * segment type instead, e.g. `AnalyticsRevenueSegment` or
 * `AnalyticsProductSegment`.
 */
export interface AnalyticsSegment {
  segment_id: number;
  segment_label?: string;
  subtotals: Record<string, unknown>;
}

/**
 * @deprecated Deprecated in 4.0 and will be removed in 5.0. Use the per-report
 * stats type instead, e.g. `AnalyticsRevenueStats`, which includes `segments`.
 */
export type AnalyticsSegmentedTotals<T> = T & {
  segments?: AnalyticsSegment[];
};

/**
 * @deprecated Deprecated in 4.0 and will be removed in 5.0. Use
 * `AnalyticsCustomersStatsResponse` or `AnalyticsStockStatsResponse` instead.
 */
export interface AnalyticsTotalsResponse<T> {
  totals: T;
}

/**
 * A single time interval in a stats response
 *
 * @deprecated Deprecated in 4.0 and will be removed in 5.0. Use the per-report
 * interval type instead, e.g. `AnalyticsRevenueInterval`.
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
 *
 * @deprecated Deprecated in 4.0 and will be removed in 5.0. Use the per-report
 * response type instead, e.g. `AnalyticsRevenueStatsResponse` or
 * `AnalyticsOrdersStatsResponse`.
 */
export interface AnalyticsStatsResponse<T>
  extends AnalyticsTotalsResponse<AnalyticsSegmentedTotals<T>> {
  intervals?: AnalyticsStatsInterval<T>[];
}
