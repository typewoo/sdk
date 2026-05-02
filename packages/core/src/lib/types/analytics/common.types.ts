/**
 * Segment within a stats response (used when segmentby is applied)
 */
export interface AnalyticsSegment {
  segment_id: number;
  segment_label?: string;
  subtotals: Record<string, unknown>;
}

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
