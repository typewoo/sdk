import { z } from 'zod';
import type { RouteMeta } from '../schema-registry.js';

/**
 * Builds the schema for one entry of a stats report's `intervals` array.
 *
 * `interval` is the period identifier, not the interval kind: WC's schema
 * declares an enum of day/week/month/year, but the API returns e.g.
 * `2021-05-03 00` (hour), `2021-05-03` (day), `2021-18` (week),
 * `2021-05` (month), `2021-2` (quarter) or `2021` (year).
 */
export function analyticsStatsIntervalSchema<T extends z.ZodType>(
  subtotals: T
) {
  return z.looseObject({
    interval: z
      .string()
      .describe(
        'Period identifier for the interval, formatted by the requested interval (e.g. "2021-05-03" for day, "2021-18" for week, "2021-05" for month, "2021" for year).'
      ),
    date_start: z
      .string()
      .describe("The date the report start, in the site's timezone."),
    date_start_gmt: z.string().describe('The date the report start, as GMT.'),
    date_end: z
      .string()
      .describe("The date the report end, in the site's timezone."),
    date_end_gmt: z.string().describe('The date the report end, as GMT.'),
    subtotals: subtotals.describe('Interval subtotals.'),
  });
}

/**
 * Builds the schema for one element of a stats report's `segments` array
 * (populated when `segmentby` is set).
 *
 * `segment_id` is numeric for product/variation/category segments but a
 * string for others (e.g. `"200"` for `segmentby=coupon`). `segment_label` is
 * the product/variation/category name where there is one, and `null` for
 * segments without a name (e.g. `segmentby=customer_type`); WC's schema omits
 * it for most reports. Pass `labelRequired` for the products/variations
 * reports, whose schema declares it and whose segments are always named.
 */
export function analyticsStatsSegmentSchema<T extends z.ZodType>(
  subtotals: T,
  options: { labelRequired?: boolean } = {}
) {
  const label = z
    .string()
    .describe(
      'Human readable segment label (e.g. the product, variation or category name), or null when the segment has none.'
    );
  return z.looseObject({
    segment_id: z
      .union([z.number(), z.string()])
      .describe('Segment identificator.'),
    segment_label: options.labelRequired ? label : label.nullable().optional(),
    subtotals: subtotals.describe('Interval subtotals.'),
  });
}

type SchemaBugAck = NonNullable<RouteMeta['knownSchemaBugs']>[number];

/** Registry ack shared by every `/stats` report for the `interval` enum bug. */
export const ANALYTICS_STATS_INTERVAL_ID_BUG: SchemaBugAck = {
  field: 'intervals[].interval',
  reason:
    'Declared as the day/week/month/year enum, but the API returns the period identifier (e.g. "2021-05-03", "2021-18", "2021").',
  driftKinds: ['enum-drift'],
};

/** Paths of `segment_label` in a stats response (totals and intervals). */
export const ANALYTICS_STATS_SEGMENT_LABEL_FIELDS = [
  'totals.segments[].segment_label',
  'intervals[].subtotals.segments[].segment_label',
];

/**
 * Registry acks for reports (products, variations) whose WC schema copies the
 * interval enum onto `segment_label`, which is really a free-text name.
 */
export const ANALYTICS_STATS_SEGMENT_LABEL_ENUM_BUGS: SchemaBugAck[] =
  ANALYTICS_STATS_SEGMENT_LABEL_FIELDS.map((field) => ({
    field,
    reason:
      'Declared with the day/week/month/year enum, but the API returns the product/variation name.',
    driftKinds: ['enum-drift'],
  }));
