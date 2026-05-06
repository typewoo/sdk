import { z } from 'zod';
import { schemaRegistry } from '../../schema-registry.js';
import {
  AnalyticsDownloadSchema,
  AnalyticsDownloadStatsSchema,
  AnalyticsDownloadIntervalSchema,
} from './downloads.schema.js';
import {
  AnalyticsDownloadsListQueryParamsSchema,
  AnalyticsDownloadsStatsQueryParamsSchema,
} from './downloads.query.schema.js';

schemaRegistry.add(AnalyticsDownloadSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads',
  kind: 'response',
});
schemaRegistry.add(AnalyticsDownloadsListQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads',
  kind: 'query',
  method: 'GET',
});
schemaRegistry.add(
  z.looseObject({
    totals: AnalyticsDownloadStatsSchema,
    intervals: z.array(AnalyticsDownloadIntervalSchema).optional(),
  }),
  {
    surface: 'analytics',
    route: '/wc-analytics/reports/downloads/stats',
    kind: 'response',
  }
);
schemaRegistry.add(AnalyticsDownloadsStatsQueryParamsSchema, {
  surface: 'analytics',
  route: '/wc-analytics/reports/downloads/stats',
  kind: 'query',
  method: 'GET',
});

export * from './downloads.schema.js';
export * from './downloads.query.schema.js';
