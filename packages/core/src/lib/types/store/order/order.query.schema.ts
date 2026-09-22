import { z } from 'zod';
import { CheckoutCreateRequestSchema } from '../checkout/checkout.create.schema.js';
import { CheckoutBillingResponseSchema } from '../checkout/checkout.billing.schema.js';

/**
 * Body for paying for an existing order (`POST /checkout/{id}`), e.g. a
 * pending order the customer returns to. Shares its fields with checkout.
 */
export const OrderRequestSchema = CheckoutCreateRequestSchema.pick({
  shipping_address: true,
  customer_note: true,
  payment_method: true,
  payment_data: true,
  additional_fields: true,
  extensions: true,
}).extend({
  /**
   * The order key, used to verify access to the order. Not declared in
   * WooCommerce's schema; the route's permission check reads it.
   */
  key: z.string().describe('The order key, used to verify the order.'),
  /**
   * The email address used to verify guest orders. Not declared in
   * WooCommerce's schema; the route's permission check reads it.
   */
  billing_email: z
    .string()
    .optional()
    .describe('The email address used to verify guest orders.'),
  /**
   * Billing address for the order. Required by WooCommerce.
   */
  billing_address: CheckoutBillingResponseSchema.describe('Billing address.'),
});

export type OrderRequest = z.input<typeof OrderRequestSchema>;

/**
 * Query parameters for fetching a pay-for-order order
 * (`GET /order/{id}`).
 */
export const OrderQueryParamsSchema = z.object({
  /**
   * Scope under which the request is made; determines fields present in
   * response.
   */
  context: z
    .enum(['edit', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  /**
   * The order key, used to verify access to the order. Not declared in
   * WooCommerce's schema; the route's permission check reads it.
   */
  key: z.string().describe('The order key, used to verify the order.'),
  /**
   * The email address used to verify guest orders. Not declared in
   * WooCommerce's schema; the route's permission check reads it.
   */
  billing_email: z
    .string()
    .optional()
    .describe('The email address used to verify guest orders.'),
});

export type OrderQueryParams = z.input<typeof OrderQueryParamsSchema>;
