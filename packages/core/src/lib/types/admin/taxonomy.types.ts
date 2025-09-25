import { WcAdminImage } from './common.types.js';

/**
 * Category display type
 */
export type WcAdminCategoryDisplay =
  | 'default'
  | 'products'
  | 'subcategories'
  | 'both';

/**
 * WooCommerce REST API Product Category Response
 */
export interface WcAdminProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: WcAdminCategoryDisplay;
  image: WcAdminImage | null;
  menu_order: number;
  count: number;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up?: Array<{ href: string }>;
  };
}

/**
 * Product category request parameters for creating/updating
 */
export interface WcAdminProductCategoryRequest {
  name?: string;
  slug?: string;
  parent?: number;
  description?: string;
  display?: WcAdminCategoryDisplay;
  image?: WcAdminImage;
  menu_order?: number;
}

/**
 * Product category query parameters for listing
 */
export interface WcAdminProductCategoryQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?:
    | 'id'
    | 'include'
    | 'name'
    | 'slug'
    | 'term_group'
    | 'description'
    | 'count';
  hide_empty?: boolean;
  parent?: number;
  product?: number;
  slug?: string;
}

/**
 * WooCommerce REST API Product Tag Response
 */
export interface WcAdminProductTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Product tag request parameters for creating/updating
 */
export interface WcAdminProductTagRequest {
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * Product tag query parameters for listing
 */
export interface WcAdminProductTagQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?:
    | 'id'
    | 'include'
    | 'name'
    | 'slug'
    | 'term_group'
    | 'description'
    | 'count';
  hide_empty?: boolean;
  parent?: number;
  product?: number;
  slug?: string;
}

/**
 * WooCommerce REST API Shipping Class Response
 */
export interface WcAdminShippingClass {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Shipping class request parameters for creating/updating
 */
export interface WcAdminShippingClassRequest {
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * Shipping class query parameters for listing
 */
export interface WcAdminShippingClassQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?:
    | 'id'
    | 'include'
    | 'name'
    | 'slug'
    | 'term_group'
    | 'description'
    | 'count';
  hide_empty?: boolean;
  parent?: number;
  product?: number;
  slug?: string;
}
