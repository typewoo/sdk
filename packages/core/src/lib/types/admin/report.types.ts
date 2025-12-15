import { z } from 'zod';

export const AdminReportSchema = z.looseObject({
  slug: z.string(),
  description: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminReport = z.infer<typeof AdminReportSchema>;

export const AdminSalesReportSchema = z.looseObject({
  total_sales: z.string(),
  net_sales: z.string(),
  average_sales: z.string(),
  total_orders: z.number(),
  total_items: z.number(),
  total_tax: z.string(),
  total_shipping: z.string(),
  total_refunds: z.string(),
  total_discount: z.string(),
  totals_grouped_by: z.string(),
  totals: z.record(
    z.string(),
    z.object({
      sales: z.string(),
      orders: z.number(),
      items: z.number(),
      tax: z.string(),
      shipping: z.string(),
      discount: z.string(),
      customers: z.number(),
    })
  ),
  _links: z.object({
    about: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSalesReport = z.infer<typeof AdminSalesReportSchema>;

export const AdminTopSellersReportSchema = z.looseObject({
  title: z.string(),
  product_id: z.number(),
  quantity: z.number(),
  _links: z.object({
    about: z.array(z.object({ href: z.string() })),
    product: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTopSellersReport = z.infer<typeof AdminTopSellersReportSchema>;

export const AdminCustomersReportSchema = z.looseObject({
  slug: z.string(),
  name: z.string(),
  total: z.number(),
});

export type AdminCustomersReport = z.infer<typeof AdminCustomersReportSchema>;

export const AdminOrdersReportSchema = z.looseObject({
  slug: z.string(),
  name: z.string(),
  total: z.number(),
});

export type AdminOrdersReport = z.infer<typeof AdminOrdersReportSchema>;

// Generic totals report entry used by several totals endpoints
export const AdminTotalsReportEntrySchema = z.looseObject({
  slug: z.string(),
  name: z.string().optional(),
  total: z.union([z.number(), z.string()]),
});

export type AdminTotalsReportEntry = z.infer<
  typeof AdminTotalsReportEntrySchema
>;

export const AdminReportsQueryParamsSchema = z.looseObject({
  context: z.enum(['view']).optional(),
  period: z.enum(['week', 'month', 'last_month', 'year']).optional(),
  date_min: z.string().optional(),
  date_max: z.string().optional(),
  force_cache_refresh: z.boolean().optional(),
});

export type AdminReportsQueryParams = z.infer<
  typeof AdminReportsQueryParamsSchema
>;

export const AdminSalesReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    interval: z.enum(['day', 'week', 'month', 'year']).optional(),
  });

export type AdminSalesReportQueryParams = z.infer<
  typeof AdminSalesReportQueryParamsSchema
>;

export const AdminTopSellersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    per_page: z.number().optional(),
    page: z.number().optional(),
  });

export type AdminTopSellersReportQueryParams = z.infer<
  typeof AdminTopSellersReportQueryParamsSchema
>;

export const AdminCustomersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    registered_before: z.string().optional(),
    registered_after: z.string().optional(),
    orders_count_min: z.number().optional(),
    orders_count_max: z.number().optional(),
    total_spend_min: z.string().optional(),
    total_spend_max: z.string().optional(),
    avg_order_value_min: z.string().optional(),
    avg_order_value_max: z.string().optional(),
    last_active_before: z.string().optional(),
    last_active_after: z.string().optional(),
    per_page: z.number().optional(),
    page: z.number().optional(),
  });

export type AdminCustomersReportQueryParams = z.infer<
  typeof AdminCustomersReportQueryParamsSchema
>;

export const AdminOrdersReportQueryParamsSchema =
  AdminReportsQueryParamsSchema.extend({
    match: z.enum(['all', 'any']).optional(),
    status: z.array(z.string()).optional(),
    product: z.array(z.number()).optional(),
    variation: z.array(z.number()).optional(),
    category: z.array(z.number()).optional(),
    coupon: z.array(z.number()).optional(),
    customer: z.array(z.number()).optional(),
  });

export type AdminOrdersReportQueryParams = z.infer<
  typeof AdminOrdersReportQueryParamsSchema
>;
