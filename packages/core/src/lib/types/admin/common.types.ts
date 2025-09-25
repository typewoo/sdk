/**
 * Common meta data structure used across multiple WooCommerce resources
 */
export interface WcAdminMetaData {
  /**
   * Meta ID.
   */
  id: number;
  /**
   * Meta key.
   */
  key: string;
  /**
   * Meta value.
   */
  value: string | number | boolean | object | null;
}

/**
 * Common address structure for billing and shipping
 */
export interface WcAdminAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string; // Only present on billing
  phone?: string;
}

/**
 * Common links structure
 */
export interface WcAdminLinks {
  self: Array<{ href: string }>;
  collection?: Array<{ href: string }>;
}

/**
 * Common image structure
 */
export interface WcAdminImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

/**
 * Common dimension structure
 */
export interface WcAdminDimensions {
  length: string;
  width: string;
  height: string;
}

/**
 * Common tax structure
 */
export interface WcAdminTaxLine {
  id: number;
  total: string;
  subtotal: string;
}

/**
 * Common status values
 */
export type WcAdminStatus = 'draft' | 'pending' | 'private' | 'publish';

/**
 * Order status values
 */
export type WcAdminOrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'checkout-draft';

/**
 * Product type values
 */
export type WcAdminProductType = 'simple' | 'grouped' | 'external' | 'variable';

/**
 * Stock status values
 */
export type WcAdminStockStatus = 'instock' | 'outofstock' | 'onbackorder';

/**
 * Backorder values
 */
export type WcAdminBackorderStatus = 'no' | 'notify' | 'yes';

/**
 * Tax status values
 */
export type WcAdminTaxStatus = 'taxable' | 'shipping' | 'none';

/**
 * Catalog visibility values
 */
export type WcAdminCatalogVisibility =
  | 'visible'
  | 'catalog'
  | 'search'
  | 'hidden';
