import { WcAdminMetaData } from './common.types.js';

/**
 * Coupon discount type
 */
export type WcAdminCouponDiscountType =
  | 'percent'
  | 'fixed_cart'
  | 'fixed_product';

/**
 * WooCommerce REST API Coupon Response
 */
export interface WcAdminCoupon {
  /**
   * Unique identifier for the object.
   */
  id: number;
  /**
   * Coupon code.
   */
  code: string;
  /**
   * The amount of discount. Should always be numeric, even if setting a percentage.
   */
  amount: string;
  /**
   * The date the coupon was created, in the site's timezone.
   */
  date_created: string;
  /**
   * The date the coupon was created, as GMT.
   */
  date_created_gmt: string;
  /**
   * The date the coupon was last modified, in the site's timezone.
   */
  date_modified: string;
  /**
   * The date the coupon was last modified, as GMT.
   */
  date_modified_gmt: string;
  /**
   * Determines the type of discount that will be applied. Options: `percent`, `fixed_cart` and `fixed_product`. Default is `fixed_cart`.
   */
  discount_type: WcAdminCouponDiscountType;
  /**
   * Coupon description.
   */
  description: string;
  /**
   * The date the coupon expires, in the site's timezone.
   */
  date_expires: string | null;
  /**
   * The date the coupon expires, as GMT.
   */
  date_expires_gmt: string | null;
  /**
   * Number of times the coupon has been used already.
   */
  usage_count: number;
  /**
   * 	If `true`, the coupon can only be used individually. Other applied coupons will be removed from the cart. Default is `false`.
   */
  individual_use: boolean;
  /**
   * List of product IDs the coupon can be used on.
   */
  product_ids: number[];
  /**
   * List of product IDs the coupon cannot be used on.
   */
  excluded_product_ids: number[];
  /**
   * How many times the coupon can be used in total.
   */
  usage_limit: number | null;
  /**
   * How many times the coupon can be used per customer.
   */
  usage_limit_per_user: number | null;
  /**
   * Max number of items in the cart the coupon can be applied to.
   */
  limit_usage_to_x_items: number | null;
  /**
   * 	If `true` and if the free shipping method requires a coupon, this coupon will enable free shipping. Default is `false`.
   */
  free_shipping: boolean;
  /**
   * List of category IDs the coupon applies to.
   */
  product_categories: number[];
  /**
   * List of category IDs the coupon does not apply to.
   */
  excluded_product_categories: number[];
  /**
   * If `true`, this coupon will not be applied to items that have sale prices. Default is `false`.
   */
  exclude_sale_items: boolean;
  /**
   * Minimum order amount that needs to be in the cart before coupon applies.
   */
  minimum_amount: string;
  /**
   * Maximum order amount allowed when using the coupon.
   */
  maximum_amount: string;
  /**
   * List of email addresses that can use this coupon.
   */
  email_restrictions: string[];
  /**
   * List of user IDs (or guest email addresses) that have used the coupon.rea
   */
  used_by: string[];
  meta_data: WcAdminMetaData[];
  _links?: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

/**
 * Coupon request parameters for creating/updating
 */
export interface WcAdminCouponRequest {
  code?: string;
  amount?: string;
  discount_type?: WcAdminCouponDiscountType;
  description?: string;
  date_expires?: string;
  date_expires_gmt?: string;
  individual_use?: boolean;
  product_ids?: number[];
  excluded_product_ids?: number[];
  usage_limit?: number;
  usage_limit_per_user?: number;
  limit_usage_to_x_items?: number;
  free_shipping?: boolean;
  product_categories?: number[];
  excluded_product_categories?: number[];
  exclude_sale_items?: boolean;
  minimum_amount?: string;
  maximum_amount?: string;
  email_restrictions?: string[];
  meta_data?: WcAdminMetaData[];
}

/**
 * Coupon query parameters for listing
 */
export interface WcAdminCouponQueryParams {
  /**
   * Scope under which the request is made; determines fields present in response. Options: `view` and `edit`. Default is `view`.
   */
  context?: 'view' | 'edit';
  /**
   * Current page of the collection. Default is 1.
   */
  page?: number;
  /**
   * Maximum number of items to be returned in result set. Default is 10.
   */
  per_page?: number;
  /**
   * Limit results to those matching a string.
   */
  search?: string;
  /**
   * Limit response to resources published after a given ISO8601 compliant date.
   */
  after?: string;
  /**
   * Limit response to resources published before a given ISO8601 compliant date.
   */
  before?: string;
  /**
   * Limit response to resources modified after a given ISO8601 compliant date.
   */
  modified_after?: string;
  /**
   * Limit response to resources modified after a given ISO8601 compliant date.
   */
  modified_before?: string;
  /**
   * Whether to interpret dates as GMT when limiting response by published or modified date.
   */
  dates_are_gmt?: boolean;
  /**
   * Ensure result set excludes specific IDs.
   */
  exclude?: number[];
  /**
   * Limit result set to specific ids.
   */
  include?: number[];
  /**
   * Offset the result set by a specific number of items.
   */
  offset?: number;
  /**
   * Order sort attribute ascending or descending. Options: `asc` and `desc`. Default is `desc`.
   */
  order?: 'asc' | 'desc';
  /**
   * Sort collection by object attribute. Options: `date`, `modified`, `id`, `include`, `title` and `slug`. Default is `date`.
   */
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
  /**
   * Limit result set to resources with a specific code.
   */
  code?: string;
}
