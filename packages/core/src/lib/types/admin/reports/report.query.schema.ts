import { z } from 'zod';

/**
 * Query parameters for `/reports` and the `/reports/{type}/totals` endpoints.
 */
export const AdminReportsQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminReportsQueryParams = z.input<
  typeof AdminReportsQueryParamsSchema
>;

/**
 * Query parameters for `/reports/sales`.
 */
export const AdminSalesReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    period: z
      .enum(['week', 'month', 'last_month', 'year'])
      .optional()
      .describe('Report period.'),
    date_min: z
      .string()
      .optional()
      .describe(
        'Return sales for a specific start date, the date need to be in the YYYY-MM-DD format.'
      ),
    date_max: z
      .string()
      .optional()
      .describe(
        'Return sales for a specific end date, the date need to be in the YYYY-MM-DD format.'
      ),
  });

export type AdminSalesReportQueryParams = z.input<
  typeof AdminSalesReportQueryParamsSchema
>;

/**
 * Query parameters for `/reports/top_sellers` (same as the sales report).
 */
export const AdminTopSellersReportQueryParamsSchema =
  AdminSalesReportQueryParamsSchema.extend({});

export type AdminTopSellersReportQueryParams = z.input<
  typeof AdminTopSellersReportQueryParamsSchema
>;

/**
 * Query parameters for `/reports/customers/totals`.
 * @deprecated The endpoint takes only `context`; use {@link AdminReportsQueryParamsSchema}.
 */
export const AdminCustomersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema;

/** @deprecated Use {@link AdminReportsQueryParams}. */
export type AdminCustomersReportQueryParams = AdminReportsQueryParams;

/**
 * Query parameters for `/reports/orders/totals`.
 * @deprecated The endpoint takes only `context`; use {@link AdminReportsQueryParamsSchema}.
 */
export const AdminOrdersReportQueryParamsSchema = AdminReportsQueryParamsSchema;

/** @deprecated Use {@link AdminReportsQueryParams}. */
export type AdminOrdersReportQueryParams = AdminReportsQueryParams;
