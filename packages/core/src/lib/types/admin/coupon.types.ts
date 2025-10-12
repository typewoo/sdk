import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AdminMetaData } from './common.types.js';

/**
 * Coupon discount type
 */
export type AdminCouponDiscountType =
  | 'percent'
  | 'fixed_cart'
  | 'fixed_product';

/**
 * WooCommerce REST API Coupon Response
 */
export const AdminCouponSchema = z.object({
  /**
   * Unique identifier for the object.
   */
  id: z.number(),
  /**
   * Coupon code.
   */
  code: z.string(),
  /**
   * The amount of discount. Should always be numeric, even if setting a percentage.
   */
  amount: z.string(),
  /**
   * The date the coupon was created, in the site's timezone.
   */
  date_created: z.string(),
  /**
   * The date the coupon was created, as GMT.
   */
  date_created_gmt: z.string(),
  /**
   * The date the coupon was last modified, in the site's timezone.
   */
  date_modified: z.string(),
  /**
   * The date the coupon was last modified, as GMT.
   */
  date_modified_gmt: z.string(),
  /**
   * Determines the type of discount that will be applied. Options: `percent`, `fixed_cart` and `fixed_product`. Default is `fixed_cart`.
   */
  discount_type: z.enum(['percent', 'fixed_cart', 'fixed_product']),
  /**
   * Coupon description.
   */
  description: z.string(),
  /**
   * The date the coupon expires, in the site's timezone.
   */
  date_expires: z.string().nullable(),
  /**
   * The date the coupon expires, as GMT.
   */
  date_expires_gmt: z.string().nullable(),
  /**
   * Number of times the coupon has been used already.
   */
  usage_count: z.number(),
  /**
   * 	If `true`, the coupon can only be used individually. Other applied coupons will be removed from the cart. Default is `false`.
   */
  individual_use: z.boolean(),
  /**
   * List of product IDs the coupon can be used on.
   */
  product_ids: z.array(z.number()),
  /**
   * List of product IDs the coupon cannot be used on.
   */
  excluded_product_ids: z.array(z.number()),
  /**
   * How many times the coupon can be used in total.
   */
  usage_limit: z.number().nullable(),
  /**
   * How many times the coupon can be used per customer.
   */
  usage_limit_per_user: z.number().nullable(),
  /**
   * Max number of items in the cart the coupon can be applied to.
   */
  limit_usage_to_x_items: z.number().nullable(),
  /**
   * 	If `true` and if the free shipping method requires a coupon, this coupon will enable free shipping. Default is `false`.
   */
  free_shipping: z.boolean(),
  /**
   * List of category IDs the coupon applies to.
   */
  product_categories: z.array(z.number()),
  /**
   * List of category IDs the coupon does not apply to.
   */
  excluded_product_categories: z.array(z.number()),
  /**
   * If `true`, this coupon will not be applied to items that have sale prices. Default is `false`.
   */
  exclude_sale_items: z.boolean(),
  /**
   * Minimum order amount that needs to be in the cart before coupon applies.
   */
  minimum_amount: z.string(),
  /**
   * Maximum order amount allowed when using the coupon.
   */
  maximum_amount: z.string(),
  /**
   * List of email addresses that can use this coupon.
   */
  email_restrictions: z.array(z.string()),
  /**
   * List of user IDs (or guest email addresses) that have used the coupon.rea
   */
  used_by: z.array(z.string()),
  meta_data: z.array(AdminMetaData),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCoupon = z.infer<typeof AdminCouponSchema>;
export class ApiAdminCoupon extends createZodDto(AdminCouponSchema) {}

/**
 * Coupon request parameters for creating/updating
 */
export const AdminCouponRequestSchema = z.object({
  code: z.string().optional(),
  amount: z.string().optional(),
  discount_type: z.enum(['percent', 'fixed_cart', 'fixed_product']).optional(),
  description: z.string().optional(),
  date_expires: z.string().optional(),
  date_expires_gmt: z.string().optional(),
  individual_use: z.boolean().optional(),
  product_ids: z.array(z.number()).optional(),
  excluded_product_ids: z.array(z.number()).optional(),
  usage_limit: z.number().optional(),
  usage_limit_per_user: z.number().optional(),
  limit_usage_to_x_items: z.number().optional(),
  free_shipping: z.boolean().optional(),
  product_categories: z.array(z.number()).optional(),
  excluded_product_categories: z.array(z.number()).optional(),
  exclude_sale_items: z.boolean().optional(),
  minimum_amount: z.string().optional(),
  maximum_amount: z.string().optional(),
  email_restrictions: z.array(z.string()).optional(),
  meta_data: z.array(AdminMetaData).optional(),
});

export type AdminCouponRequest = z.infer<typeof AdminCouponRequestSchema>;
export class ApiAdminCouponRequest extends createZodDto(
  AdminCouponRequestSchema
) {}

/**
 * Coupon query parameters for listing
 */
export const AdminCouponQueryParamsSchema = z.object({
  /**
   * Scope under which the request is made; determines fields present in response. Options: `view` and `edit`. Default is `view`.
   */
  context: z.enum(['view', 'edit']).optional(),
  /**
   * Current page of the collection. Default is 1.
   */
  page: z.number().optional(),
  /**
   * Maximum number of items to be returned in result set. Default is 10.
   */
  per_page: z.number().optional(),
  /**
   * Limit results to those matching a string.
   */
  search: z.string().optional(),
  /**
   * Limit response to resources published after a given ISO8601 compliant date.
   */
  after: z.string().optional(),
  /**
   * Limit response to resources published before a given ISO8601 compliant date.
   */
  before: z.string().optional(),
  /**
   * Limit response to resources modified after a given ISO8601 compliant date.
   */
  modified_after: z.string().optional(),
  /**
   * Limit response to resources modified after a given ISO8601 compliant date.
   */
  modified_before: z.string().optional(),
  /**
   * Whether to interpret dates as GMT when limiting response by published or modified date.
   */
  dates_are_gmt: z.boolean().optional(),
  /**
   * Ensure result set excludes specific IDs.
   */
  exclude: z.array(z.number()).optional(),
  /**
   * Limit result set to specific ids.
   */
  include: z.array(z.number()).optional(),
  /**
   * Offset the result set by a specific number of items.
   */
  offset: z.number().optional(),
  /**
   * Order sort attribute ascending or descending. Options: `asc` and `desc`. Default is `desc`.
   */
  order: z.enum(['asc', 'desc']).optional(),
  /**
   * Sort collection by object attribute. Options: `date`, `modified`, `id`, `include`, `title` and `slug`. Default is `date`.
   */
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .optional(),
  /**
   * Limit result set to resources with a specific code.
   */
  code: z.string().optional(),
});

export type AdminCouponQueryParams = z.infer<
  typeof AdminCouponQueryParamsSchema
>;
export class ApiAdminCouponQueryParams extends createZodDto(
  AdminCouponQueryParamsSchema
) {}
