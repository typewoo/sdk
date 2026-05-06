import { z } from 'zod';

/**
 * Query parameters for stock list endpoint
 */
export const AnalyticsStockListQueryParamsSchema = z.object({
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
    .enum([
      'date',
      'id',
      'include',
      'sku',
      'stock_quantity',
      'stock_status',
      'title',
    ])
    .default('stock_status')
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .default('asc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  type: z
    .enum(['all', 'instock', 'lowstock', 'onbackorder', 'outofstock'])
    .default('all')
    .optional()
    .describe('Limit result set to items assigned a stock report type.'),
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  parent: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to those of particular parent IDs.'),
  parent_exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe(
      'Limit result set to all items except those of a particular parent ID.'
    ),
});
export type AnalyticsStockListQueryParams = z.infer<
  typeof AnalyticsStockListQueryParamsSchema
>;
