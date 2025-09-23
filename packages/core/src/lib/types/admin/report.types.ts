export interface WcAdminReport {
  slug: string;
  description: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface WcAdminSalesReport {
  total_sales: string;
  net_sales: string;
  average_sales: string;
  total_orders: number;
  total_items: number;
  total_tax: string;
  total_shipping: string;
  total_refunds: string;
  total_discount: string;
  totals_grouped_by: string;
  totals: {
    [key: string]: {
      sales: string;
      orders: number;
      items: number;
      tax: string;
      shipping: string;
      discount: string;
      customers: number;
    };
  };
  _links: {
    about: Array<{ href: string }>;
  };
}

export interface WcAdminTopSellersReport {
  title: string;
  product_id: number;
  quantity: number;
  _links: {
    about: Array<{ href: string }>;
    product: Array<{ href: string }>;
  };
}

export interface WcAdminCustomersReport {
  slug: string;
  name: string;
  total: number;
}

export interface WcAdminOrdersReport {
  slug: string;
  name: string;
  total: number;
}

// Generic totals report entry used by several totals endpoints
export interface WcAdminTotalsReportEntry {
  slug: string;
  name?: string;
  total: number | string;
}

export interface WcAdminReportsQueryParams {
  context?: 'view';
  period?: 'week' | 'month' | 'last_month' | 'year';
  date_min?: string;
  date_max?: string;
  force_cache_refresh?: boolean;
}

export interface WcAdminSalesReportQueryParams
  extends WcAdminReportsQueryParams {
  interval?: 'day' | 'week' | 'month' | 'year';
}

export interface WcAdminTopSellersReportQueryParams
  extends WcAdminReportsQueryParams {
  per_page?: number;
  page?: number;
}

export interface WcAdminCustomersReportQueryParams
  extends WcAdminReportsQueryParams {
  registered_before?: string;
  registered_after?: string;
  orders_count_min?: number;
  orders_count_max?: number;
  total_spend_min?: string;
  total_spend_max?: string;
  avg_order_value_min?: string;
  avg_order_value_max?: string;
  last_active_before?: string;
  last_active_after?: string;
  per_page?: number;
  page?: number;
}

export interface WcAdminOrdersReportQueryParams
  extends WcAdminReportsQueryParams {
  match?: 'all' | 'any';
  status?: string[];
  product?: number[];
  variation?: number[];
  category?: number[];
  coupon?: number[];
  customer?: number[];
}
