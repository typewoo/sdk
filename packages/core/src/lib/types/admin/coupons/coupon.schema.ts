import { z } from 'zod';

import { AdminCouponMetaData } from './coupon.js';

/**
 * WooCommerce REST API Coupon Response
 */
export const AdminCouponSchema = z.looseObject({
  id: z.number().optional().describe('Unique identifier for the object.'),
  code: z.string().optional().describe('Coupon code.'),
  status: z
    .string()
    .optional()
    .describe(
      'The status of the coupon. Should always be draft, published, or pending review'
    ),
  amount: z
    .string()
    .optional()
    .describe(
      'The amount of discount. Should always be numeric, even if setting a percentage.'
    ),
  date_created: z
    .string()
    .optional()
    .describe("The date the coupon was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .optional()
    .describe('The date the coupon was created, as GMT.'),
  date_modified: z
    .string()
    .optional()
    .describe("The date the coupon was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .optional()
    .describe('The date the coupon was last modified, as GMT.'),
  discount_type: z
    .enum(['percent', 'fixed_cart', 'fixed_product'])
    .default('fixed_cart')
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
  usage_count: z
    .number()
    .describe('Number of times the coupon has been used already.'),
  individual_use: z
    .boolean()
    .default(false)
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
    .describe('List of product IDs the coupon cannot be used on.'),
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
    .default(false)
    .optional()
    .describe(
      'If true and if the free shipping method requires a coupon, this coupon will enable free shipping.'
    ),
  product_categories: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon applies to.'),
  excluded_product_categories: z
    .array(z.number())
    .optional()
    .describe('List of category IDs the coupon does not apply to.'),
  exclude_sale_items: z
    .boolean()
    .default(false)
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
  used_by: z
    .array(z.string())
    .describe(
      'List of user IDs (or guest email addresses) that have used the coupon.'
    ),
  meta_data: z.array(AdminCouponMetaData).optional().describe('Meta data.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminCoupon = z.infer<typeof AdminCouponSchema>;
