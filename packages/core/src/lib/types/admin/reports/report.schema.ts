import { z } from 'zod';

export const AdminReportSchema = z.looseObject({
  slug: z.string().describe('An alphanumeric identifier for the resource.'),
  description: z
    .string()
    .describe('A human-readable description of the resource.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminReport = z.infer<typeof AdminReportSchema>;

export const AdminSalesReportSchema = z.looseObject({
  total_sales: z.string().describe('Gross sales in the period.'),
  net_sales: z.string().describe('Net sales in the period.'),
  average_sales: z.string().describe('Average net daily sales.'),
  total_orders: z.number().describe('Total of orders placed.'),
  total_items: z.number().describe('Total of items purchased.'),
  total_tax: z.string().describe('Total charged for taxes.'),
  total_shipping: z.string().describe('Total charged for shipping.'),
  total_refunds: z.number().describe('Total of refunded orders.'),
  total_discount: z.string().describe('Total of coupons used.'),
  totals_grouped_by: z.string().describe('Group type.'),
  totals: z
    .record(
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
    )
    .describe('Totals.'),
  total_customers: z
    .number()
    .optional()
    .describe('Number of customers who registered in the period.'),
  _links: z.object({
    about: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSalesReport = z.infer<typeof AdminSalesReportSchema>;

export const AdminTopSellersReportSchema = z.looseObject({
  name: z.string().describe('Product name.'),
  product_id: z.number().describe('Product ID.'),
  quantity: z.number().describe('Total number of purchases.'),
  _links: z.object({
    about: z.array(z.object({ href: z.string() })),
    product: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminTopSellersReport = z.infer<typeof AdminTopSellersReportSchema>;

/**
 * Entry of a totals report (`/reports/{coupons,customers,orders,products,reviews}/totals`).
 */
export const AdminTotalsReportEntrySchema = z.looseObject({
  slug: z.string().describe('An alphanumeric identifier for the resource.'),
  name: z.string().optional().describe('Name of the group being counted.'),
  total: z.number().describe('Number of items in the group.'),
});

export type AdminTotalsReportEntry = z.infer<
  typeof AdminTotalsReportEntrySchema
>;

/** Entry of `/reports/customers/totals`. */
export const AdminCustomersReportSchema = AdminTotalsReportEntrySchema;

export type AdminCustomersReport = AdminTotalsReportEntry;

/** Entry of `/reports/orders/totals`. */
export const AdminOrdersReportSchema = AdminTotalsReportEntrySchema;

export type AdminOrdersReport = AdminTotalsReportEntry;
