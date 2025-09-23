/**
 * WooCommerce REST API Product Attribute Response
 */
export interface WcAdminProductAttribute {
  id: number;
  name: string;
  slug: string;
  type: 'select';
  order_by: 'menu_order' | 'name' | 'name_num' | 'id';
  has_archives: boolean;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Product attribute request parameters for creating/updating
 */
export interface WcAdminProductAttributeRequest {
  name?: string;
  slug?: string;
  type?: 'select';
  order_by?: 'menu_order' | 'name' | 'name_num' | 'id';
  has_archives?: boolean;
}

/**
 * Product attribute query parameters for listing
 */
export interface WcAdminProductAttributeQueryParams {
  context?: 'view' | 'edit';
}

/**
 * WooCommerce REST API Product Attribute Term Response
 */
export interface WcAdminProductAttributeTerm {
  id: number;
  name: string;
  slug: string;
  description: string;
  menu_order: number;
  count: number;
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

/**
 * Product attribute term request parameters for creating/updating
 */
export interface WcAdminProductAttributeTermRequest {
  name?: string;
  slug?: string;
  description?: string;
  menu_order?: number;
}

/**
 * Product attribute term query parameters for listing
 */
export interface WcAdminProductAttributeTermQueryParams {
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
