import { WcAdminMetaData } from './common.types.js';

export interface WcAdminRefund {
  id: number;
  date_created: string;
  date_created_gmt: string;
  amount: string;
  reason: string;
  refunded_by: number;
  refunded_payment: boolean;
  meta_data: WcAdminMetaData[];
  line_items: WcAdminRefundLineItem[];
  shipping_lines: WcAdminRefundShippingLine[];
  tax_lines: WcAdminRefundTaxLine[];
  fee_lines: WcAdminRefundFeeLine[];
  api_refund: boolean;
  api_restock: boolean;
  order_id: number;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

export interface WcAdminRefundLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Array<{
    id: number;
    total: string;
    subtotal: string;
  }>;
  meta_data: WcAdminMetaData[];
  sku: string;
  price: number;
}

export interface WcAdminRefundShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  instance_id: string;
  total: string;
  total_tax: string;
  taxes: Array<{
    id: number;
    total: string;
  }>;
  meta_data: WcAdminMetaData[];
}

export interface WcAdminRefundTaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  rate_percent: number;
  meta_data: WcAdminMetaData[];
}

export interface WcAdminRefundFeeLine {
  id: number;
  name: string;
  tax_class: string;
  tax_status: 'taxable' | 'none';
  total: string;
  total_tax: string;
  taxes: Array<{
    id: number;
    total: string;
    subtotal: string;
  }>;
  meta_data: WcAdminMetaData[];
}

export interface WcAdminRefundQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
  parent?: number[];
  parent_exclude?: number[];
  dp?: number;
}

/**
 * Request payload for creating a refund for a specific order
 * Follows WooCommerce /wc/v3/orders/{orderId}/refunds POST args.
 * Note: line_items/shipping_lines/tax_lines/fee_lines shapes vary; use loose records.
 */
export interface WcAdminRefundCreateRequest {
  amount: string;
  reason?: string;
  refunded_by?: number;
  refunded_payment?: boolean;
  api_refund?: boolean;
  api_restock?: boolean;
  line_items?: Array<Record<string, unknown>>;
  shipping_lines?: Array<Record<string, unknown>>;
  tax_lines?: Array<Record<string, unknown>>;
  fee_lines?: Array<Record<string, unknown>>;
}
