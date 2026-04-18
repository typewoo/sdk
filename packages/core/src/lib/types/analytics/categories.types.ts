import { z } from 'zod';
import {
  AnalyticsStatsQueryParamsSchema,
  AnalyticsListQueryParamsSchema,
} from './common.types.js';

/**
 * Category stats totals/subtotals shape
 */
export const AnalyticsCategoryStatsSchema = z.object({
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  products_count: z.number(),
});
export type AnalyticsCategoryStats = z.infer<
  typeof AnalyticsCategoryStatsSchema
>;

/**
 * Extended info for a category detail row
 */
export const AnalyticsCategoryExtendedInfoSchema = z.object({
  name: z.string().optional(),
});
export type AnalyticsCategoryExtendedInfo = z.infer<
  typeof AnalyticsCategoryExtendedInfoSchema
>;

/**
 * Single category row from the categories detail endpoint
 */
export const AnalyticsCategorySchema = z.object({
  category_id: z.number(),
  items_sold: z.number(),
  net_revenue: z.number(),
  orders_count: z.number(),
  products_count: z.number(),
  extended_info: AnalyticsCategoryExtendedInfoSchema.optional(),
});
export type AnalyticsCategory = z.infer<typeof AnalyticsCategorySchema>;

/**
 * Query parameters for categories stats endpoint
 */
export const AnalyticsCategoriesStatsQueryParamsSchema =
  AnalyticsStatsQueryParamsSchema.extend({
    categories: z.array(z.number()).optional(),
    status_is: z.array(z.string()).optional(),
    status_is_not: z.array(z.string()).optional(),
  });
export type AnalyticsCategoriesStatsQueryParams = z.infer<
  typeof AnalyticsCategoriesStatsQueryParamsSchema
>;

/**
 * Query parameters for categories list (detail) endpoint
 */
export const AnalyticsCategoriesListQueryParamsSchema =
  AnalyticsListQueryParamsSchema.extend({
    categories: z.array(z.number()).optional(),
    status_is: z.array(z.string()).optional(),
    status_is_not: z.array(z.string()).optional(),
  });
export type AnalyticsCategoriesListQueryParams = z.infer<
  typeof AnalyticsCategoriesListQueryParamsSchema
>;
