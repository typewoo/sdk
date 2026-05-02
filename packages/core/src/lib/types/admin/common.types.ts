/**
 * Common status values
 */
export type AdminStatus = 'draft' | 'pending' | 'private' | 'publish';

/**
 * Order status values
 */
export type AdminOrderStatus =
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
export type AdminProductType = 'simple' | 'grouped' | 'external' | 'variable';

/**
 * Stock status values
 */
export type AdminStockStatus = 'instock' | 'outofstock' | 'onbackorder';

/**
 * Backorder values
 */
export type AdminBackorderStatus = 'no' | 'notify' | 'yes';

/**
 * Tax status values
 */
export type AdminTaxStatus = 'taxable' | 'shipping' | 'none';

/**
 * Catalog visibility values
 */
export type AdminCatalogVisibility =
  | 'visible'
  | 'catalog'
  | 'search'
  | 'hidden';
