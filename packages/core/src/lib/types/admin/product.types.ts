import {
  WcAdminMetaData,
  WcAdminImage,
  WcAdminDimensions,
  WcAdminStockStatus,
  WcAdminBackorderStatus,
  WcAdminTaxStatus,
  WcAdminCatalogVisibility,
  WcAdminProductType,
  WcAdminStatus,
} from './common.types.js';

/**
 * Product category reference in product
 */
export interface WcAdminProductCategory {
  id: number;
  name: string;
  slug: string;
}

/**
 * Product tag reference in product
 */
export interface WcAdminProductTag {
  id: number;
  name: string;
  slug: string;
}

/**
 * Product brand reference in product
 */
export interface WcProductBrand {
  id: number;
  name: string;
  slug: string;
}

/**
 * Product attribute in product
 */
export interface WcProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

/**
 * Product default attribute for variations
 */
export interface WcProductDefaultAttribute {
  id: number;
  name: string;
  option: string;
}

/**
 * Downloadable file
 */
export interface WcDownloadableFile {
  id: string;
  name: string;
  file: string;
}

/**
 * WooCommerce REST API Product Response
 */
export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: WcAdminProductType;
  status: WcAdminStatus;
  featured: boolean;
  catalog_visibility: WcAdminCatalogVisibility;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: WcDownloadableFile[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: WcAdminTaxStatus;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: WcAdminStockStatus;
  backorders: WcAdminBackorderStatus;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: WcAdminDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: WcAdminProductCategory[];
  tags: WcAdminProductTag[];
  brands?: WcProductBrand[]; // Optional, depends on plugins
  images: WcAdminImage[];
  attributes: WcProductAttribute[];
  default_attributes: WcProductDefaultAttribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  price_range: string | null;
  meta_data: WcAdminMetaData[];
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Product variation for variable products
 */
export interface WcProductVariation {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  status: 'publish' | 'private' | 'draft';
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: WcDownloadableFile[];
  download_limit: number;
  download_expiry: number;
  tax_status: WcAdminTaxStatus;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: WcAdminStockStatus;
  backorders: WcAdminBackorderStatus;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  weight: string;
  dimensions: WcAdminDimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: WcAdminImage;
  attributes: WcProductDefaultAttribute[];
  menu_order: number;
  meta_data: WcAdminMetaData[];
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Product request parameters for creating/updating
 */
export interface WcProductRequest {
  name?: string;
  slug?: string;
  type?: WcAdminProductType;
  status?: WcAdminStatus;
  featured?: boolean;
  catalog_visibility?: WcAdminCatalogVisibility;
  description?: string;
  short_description?: string;
  sku?: string;
  regular_price?: string;
  sale_price?: string;
  date_on_sale_from?: string;
  date_on_sale_from_gmt?: string;
  date_on_sale_to?: string;
  date_on_sale_to_gmt?: string;
  virtual?: boolean;
  downloadable?: boolean;
  downloads?: WcDownloadableFile[];
  download_limit?: number;
  download_expiry?: number;
  external_url?: string;
  button_text?: string;
  tax_status?: WcAdminTaxStatus;
  tax_class?: string;
  manage_stock?: boolean;
  stock_quantity?: number;
  stock_status?: WcAdminStockStatus;
  backorders?: WcAdminBackorderStatus;
  low_stock_amount?: number;
  sold_individually?: boolean;
  weight?: string;
  dimensions?: WcAdminDimensions;
  shipping_class?: string;
  reviews_allowed?: boolean;
  upsell_ids?: number[];
  cross_sell_ids?: number[];
  parent_id?: number;
  purchase_note?: string;
  categories?: Array<{ id: number }>;
  tags?: Array<{ id: number }>;
  brands?: Array<{ id: number }>;
  images?: WcAdminImage[];
  attributes?: WcProductAttribute[];
  default_attributes?: WcProductDefaultAttribute[];
  menu_order?: number;
  meta_data?: WcAdminMetaData[];
}

/**
 * Product query parameters for listing
 */
export interface WcProductQueryParams {
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
  orderby?:
    | 'date'
    | 'id'
    | 'include'
    | 'title'
    | 'slug'
    | 'modified'
    | 'menu_order';
  parent?: number[];
  parent_exclude?: number[];
  slug?: string;
  status?:
    | 'any'
    | 'future'
    | 'trash'
    | 'draft'
    | 'pending'
    | 'private'
    | 'publish';
  type?: WcAdminProductType;
  sku?: string;
  featured?: boolean;
  category?: string;
  tag?: string;
  shipping_class?: string;
  attribute?: string;
  attribute_term?: string;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: WcAdminStockStatus;
  include_meta?: string[];
  exclude_meta?: string[];
}

/**
 * Query params for listing product custom-field names
 * Endpoint: wp-json/wc/v3/products/custom-fields/names
 */
export interface WcProductCustomFieldNameQueryParams {
  context?: 'view' | 'edit';
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
}
