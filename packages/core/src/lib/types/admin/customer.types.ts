import { WcAdminMetaData, WcAdminAddress } from './common.types.js';

/**
 * WooCommerce REST API Customer Response
 */
export interface WcAdminCustomer {
  /**
   * Unique identifier for the resource.
   */
  id: number;
  /**
   * The date the customer was created, in the site's timezone.
   */
  date_created: string;
  /**
   * The date the customer was created, as GMT.
   */
  date_created_gmt: string;
  /**
   * The date the customer was last modified, in the site's timezone.
   */
  date_modified: string;
  /**
   * The date the customer was last modified, as GMT.
   */
  date_modified_gmt: string;
  /**
   * The email address for the customer.
   */
  email: string;
  /**
   * Customer first name.
   */
  first_name: string;
  /**
   * Customer last name.
   */
  last_name: string;
  /**
   * Customer role.
   */
  role: string;
  /**
   * Customer login name.
   */
  username: string;
  billing: WcAdminAddress;
  shipping: Omit<WcAdminAddress, 'email' | 'phone'>;
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: WcAdminMetaData[];
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Customer request parameters for creating/updating
 */
export interface WcAdminCustomerRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  billing?: WcAdminAddress;
  shipping?: Omit<WcAdminAddress, 'email' | 'phone'>;
  meta_data?: WcAdminMetaData[];
}

/**
 * Customer query parameters for listing
 */
export interface WcAdminCustomerQueryParams {
  context?: 'view' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'include' | 'name' | 'registered_date';
  email?: string;
  role?:
    | 'all'
    | 'administrator'
    | 'editor'
    | 'author'
    | 'contributor'
    | 'subscriber'
    | 'customer'
    | 'shop_manager';
}
