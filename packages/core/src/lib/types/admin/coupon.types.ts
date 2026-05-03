import { z } from 'zod';

const AdminCouponMetaData = z.object({
  id: z.number(),
  key: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

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
export const AdminCouponSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the object.'),
  code: z.string().describe('Coupon code.'),
  amount: z
    .string()
    .describe(
      'The amount of discount. Should always be numeric, even if setting a percentage.'
    ),
  date_created: z
    .string()
    .describe("The date the coupon was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the coupon was created, as GMT.'),
  date_modified: z
    .string()
    .describe("The date the coupon was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .describe('The date the coupon was last modified, as GMT.'),
  discount_type: z
    .enum(['percent', 'fixed_cart', 'fixed_product'])
    .describe('Determines the type of discount that will be applied.'),
  description: z.string().describe('Coupon description.'),
  date_expires: z
    .string()
    .nullable()
    .describe("The date the coupon expires, in the site's timezone."),
  date_expires_gmt: z
    .string()
    .nullable()
    .describe('The date the coupon expires, as GMT.'),
  usage_count: z
    .number()
    .describe('Number of times the coupon has been used already.'),
  individual_use: z
    .boolean()
    .describe(
      'If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.'
    ),
  product_ids: z
    .array(z.number())
    .describe('List of product IDs the coupon can be used on.'),
  excluded_product_ids: z
    .array(z.number())
    .describe('List of product IDs the coupon cannot be used on.'),
  usage_limit: z
    .number()
    .nullable()
    .describe('How many times the coupon can be used in total.'),
  usage_limit_per_user: z
    .number()
    .nullable()
    .describe('How many times the coupon can be used per customer.'),
  limit_usage_to_x_items: z
    .number()
    .nullable()
    .describe('Max number of items in the cart the coupon can be applied to.'),
  free_shipping: z
    .boolean()
    .describe(
      'If true and if the free shipping method requires a coupon, this coupon will enable free shipping.'
    ),
  product_categories: z
    .array(z.number())
    .describe('List of category IDs the coupon applies to.'),
  excluded_product_categories: z
    .array(z.number())
    .describe('List of category IDs the coupon does not apply to.'),
  exclude_sale_items: z
    .boolean()
    .describe(
      'If true, this coupon will not be applied to items that have sale prices.'
    ),
  minimum_amount: z
    .string()
    .describe(
      'Minimum order amount that needs to be in the cart before coupon applies.'
    ),
  maximum_amount: z
    .string()
    .describe('Maximum order amount allowed when using the coupon.'),
  email_restrictions: z
    .array(z.string())
    .describe('List of email addresses that can use this coupon.'),
  used_by: z
    .array(z.string())
    .describe(
      'List of user IDs (or guest email addresses) that have used the coupon.'
    ),
  meta_data: z.array(AdminCouponMetaData).describe('Meta data.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCoupon = z.infer<typeof AdminCouponSchema>;

/**
 * Coupon request parameters for POST /coupons (create).
 *
 * `code` is the only field WooCommerce requires on create. Defaults declared
 * here mirror upstream POST behaviour so hand-constructed payloads parse to
 * the same shape WC would persist.
 */
export const AdminCouponCreateRequestSchema = z.looseObject({
  code: z.string().describe('Coupon code.'),
  amount: z
    .string()
    .optional()
    .describe(
      'The amount of discount. Should always be numeric, even if setting a percentage.'
    ),
  discount_type: z
    .enum(['percent', 'fixed_cart', 'fixed_product'])
    .optional()
    .default('fixed_cart')
    .describe('Determines the type of discount that will be applied.'),
  description: z.string().optional().describe('Coupon description.'),
  date_expires: z
    .string()
    .optional()
    .describe("The date the coupon expires, in the site's timezone."),
  date_expires_gmt: z
    .string()
    .optional()
    .describe('The date the coupon expires, as GMT.'),
  individual_use: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.'
    ),
  product_ids: z
    .array(z.number())
    .optional()
    .describe('List of product IDs the coupon can be used on.'),
  excluded_product_ids: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon does not apply to.'),
  usage_limit: z
    .number()
    .optional()
    .describe('How many times the coupon can be used in total.'),
  usage_limit_per_user: z
    .number()
    .optional()
    .describe('How many times the coupon can be used per customer.'),
  limit_usage_to_x_items: z
    .number()
    .optional()
    .describe('Max number of items in the cart the coupon can be applied to.'),
  free_shipping: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true and if the free shipping method requires a coupon, this coupon will enable free shipping.'
    ),
  product_categories: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon applies to.'),
  excluded_product_categories: z.array(z.number()).optional(),
  exclude_sale_items: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, this coupon will not be applied to items that have sale prices.'
    ),
  minimum_amount: z
    .string()
    .optional()
    .describe(
      'Minimum order amount that needs to be in the cart before coupon applies.'
    ),
  maximum_amount: z
    .string()
    .optional()
    .describe('Maximum order amount allowed when using the coupon.'),
  email_restrictions: z
    .array(z.string())
    .optional()
    .describe('List of email addresses that can use this coupon.'),
  meta_data: z.array(AdminCouponMetaData).optional().describe('Meta data.'),
});

export type AdminCouponCreateRequest = z.input<
  typeof AdminCouponCreateRequestSchema
>;

/**
 * Coupon request parameters for PUT /coupons/{id} (update). Every field is
 * optional — omitted fields keep their current value on the resource.
 */
export const AdminCouponUpdateRequestSchema = z.looseObject({
  code: z.string().optional().describe('Coupon code.'),
  amount: z
    .string()
    .optional()
    .describe(
      'The amount of discount. Should always be numeric, even if setting a percentage.'
    ),
  discount_type: z
    .enum(['percent', 'fixed_cart', 'fixed_product'])
    .optional()
    .describe('Determines the type of discount that will be applied.'),
  description: z.string().optional().describe('Coupon description.'),
  date_expires: z
    .string()
    .optional()
    .describe("The date the coupon expires, in the site's timezone."),
  date_expires_gmt: z
    .string()
    .optional()
    .describe('The date the coupon expires, as GMT.'),
  individual_use: z
    .boolean()
    .optional()
    .describe(
      'If true, the coupon can only be used individually. Other applied coupons will be removed from the cart.'
    ),
  product_ids: z
    .array(z.number())
    .optional()
    .describe('List of product IDs the coupon can be used on.'),
  excluded_product_ids: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon does not apply to.'),
  usage_limit: z
    .number()
    .optional()
    .describe('How many times the coupon can be used in total.'),
  usage_limit_per_user: z
    .number()
    .optional()
    .describe('How many times the coupon can be used per customer.'),
  limit_usage_to_x_items: z
    .number()
    .optional()
    .describe('Max number of items in the cart the coupon can be applied to.'),
  free_shipping: z
    .boolean()
    .optional()
    .describe(
      'If true and if the free shipping method requires a coupon, this coupon will enable free shipping.'
    ),
  product_categories: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon applies to.'),
  excluded_product_categories: z.array(z.number()).optional(),
  exclude_sale_items: z
    .boolean()
    .optional()
    .describe(
      'If true, this coupon will not be applied to items that have sale prices.'
    ),
  minimum_amount: z
    .string()
    .optional()
    .describe(
      'Minimum order amount that needs to be in the cart before coupon applies.'
    ),
  maximum_amount: z
    .string()
    .optional()
    .describe('Maximum order amount allowed when using the coupon.'),
  email_restrictions: z
    .array(z.string())
    .optional()
    .describe('List of email addresses that can use this coupon.'),
  meta_data: z.array(AdminCouponMetaData).optional().describe('Meta data.'),
});

export type AdminCouponUpdateRequest = z.input<
  typeof AdminCouponUpdateRequestSchema
>;

/**
 * Coupon query parameters for listing
 */
export const AdminCouponQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z
    .number()
    .optional()
    .describe('Current page of the collection. Default is 1.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  modified_after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources modified after a given ISO8601 compliant date.'
    ),
  modified_before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources modified before a given ISO8601 compliant date.'
    ),
  dates_are_gmt: z
    .boolean()
    .optional()
    .describe(
      'Whether to consider GMT post dates when limiting response by published or modified date.'
    ),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .optional()
    .describe('Sort collection by object attribute.'),
  code: z
    .string()
    .optional()
    .describe('Limit result set to resources with a specific code.'),
});

export type AdminCouponQueryParams = z.infer<
  typeof AdminCouponQueryParamsSchema
>;
