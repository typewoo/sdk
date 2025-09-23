import {
  WcAdminMetaData,
  WcAdminAddress,
  WcAdminOrderStatus,
} from './common.types.js';

/**
 * Line item in an order
 */
export interface WcAdminOrderLineItem {
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
  price: string;
  image: {
    id: string;
    src: string;
  };
  parent_name?: string;
}

/**
 * Tax line in an order
 */
export interface WcAdminOrderTaxLine {
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

/**
 * Shipping line in an order
 */
export interface WcAdminOrderShippingLine {
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

/**
 * Fee line in an order
 */
export interface WcAdminOrderFeeLine {
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

/**
 * Coupon line in an order
 */
export interface WcAdminOrderCouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: WcAdminMetaData[];
}

/**
 * Order refund
 */
export interface WcAdminOrderRefund {
  id: number;
  date_created: string;
  date_created_gmt: string;
  amount: string;
  reason: string;
  refunded_by: number;
  refunded_payment: boolean;
  meta_data: WcAdminMetaData[];
  line_items: WcAdminOrderLineItem[];
  api_refund: boolean;
  api_restock: boolean;
}

/**
 * WooCommerce REST API Order Response
 */
export interface WcAdminOrder {
  id: number;
  parent_id: number;
  status: WcAdminOrderStatus;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: WcAdminAddress;
  shipping: Omit<WcAdminAddress, 'email' | 'phone'>;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string | null;
  cart_hash: string;
  number: string;
  meta_data: WcAdminMetaData[];
  line_items: WcAdminOrderLineItem[];
  tax_lines: WcAdminOrderTaxLine[];
  shipping_lines: WcAdminOrderShippingLine[];
  fee_lines: WcAdminOrderFeeLine[];
  coupon_lines: WcAdminOrderCouponLine[];
  refunds: WcAdminOrderRefund[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_formatted: string;
  status_transition: {
    note: string;
    from: string;
    to: string;
  };
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    customer?: Array<{ href: string }>;
  };
}

/**
 * Order request parameters for creating/updating
 */
export interface WcAdminOrderRequest {
  parent_id?: number;
  status?: WcAdminOrderStatus;
  currency?: string;
  customer_id?: number;
  customer_note?: string;
  billing?: WcAdminAddress;
  shipping?: Omit<WcAdminAddress, 'email' | 'phone'>;
  payment_method?: string;
  payment_method_title?: string;
  transaction_id?: string;
  meta_data?: WcAdminMetaData[];
  line_items?: Partial<WcAdminOrderLineItem>[];
  shipping_lines?: Partial<WcAdminOrderShippingLine>[];
  fee_lines?: Partial<WcAdminOrderFeeLine>[];
  coupon_lines?: Partial<WcAdminOrderCouponLine>[];
  set_paid?: boolean;
}

/**
 * Order query parameters for listing
 */
export interface WcAdminOrderQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  modified_after?: string;
  modified_before?: string;
  dates_are_gmt?: boolean;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
  parent?: number[];
  parent_exclude?: number[];
  status?: WcAdminOrderStatus | 'any' | 'trash';
  customer?: number;
  product?: number;
  dp?: number;
  include_meta?: string[];
  exclude_meta?: string[];
}

/**
 * Order note
 */
export interface WcAdminOrderNote {
  id: number;
  author: string;
  date_created: string;
  date_created_gmt: string;
  note: string;
  customer_note: boolean;
  added_by_user: boolean;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

/**
 * Order note request parameters
 */
export interface WcAdminOrderNoteRequest {
  note: string;
  customer_note?: boolean;
  added_by_user?: boolean;
}

/**
 * Order receipt generation request
 */
export interface WcAdminOrderReceiptRequest {
  expiration_date?: string;
  expiration_days?: number;
  force_new?: boolean;
}

/**
 * Order receipt response
 */
export interface WcAdminOrderReceipt {
  id: string;
  order_id: number;
  receipt_url: string;
  expiration_date: string;
  created_date: string;
}

/**
 * Email template for orders
 */
export interface WcAdminOrderEmailTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  heading: string;
  enabled: boolean;
}

/**
 * Send order email request
 */
export interface WcAdminOrderSendEmailRequest {
  email?: string;
  force_email_update?: boolean;
  template_id: WcAdminOrderEmailTemplateId;
}

/**
 * Send order details request
 */
export interface WcAdminOrderSendDetailsRequest {
  email?: string;
  force_email_update?: boolean;
}

/**
 * Available email template IDs
 */
export type WcAdminOrderEmailTemplateId =
  | 'new_order'
  | 'cancelled_order'
  | 'customer_cancelled_order'
  | 'failed_order'
  | 'customer_failed_order'
  | 'customer_on_hold_order'
  | 'customer_processing_order'
  | 'customer_completed_order'
  | 'customer_refunded_order'
  | 'customer_invoice'
  | 'customer_note'
  | 'customer_reset_password'
  | 'customer_new_account'
  | 'customer_pos_completed_order'
  | 'customer_pos_refunded_order'
  | 'new_receipt';

/**
 * Order status information
 */
export interface WcAdminOrderStatusInfo {
  slug: string;
  name: string;
  total: number;
}
