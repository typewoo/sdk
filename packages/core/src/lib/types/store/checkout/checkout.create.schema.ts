import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.schema.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.schema.js';

export const CheckoutCreateRequestSchema = z.looseObject({
  /**
   * Object of updated billing address data for the customer.
   */
  billing_address:
    CheckoutBillingResponseSchema.optional().describe('Billing address.'),
  /**
   * Object of updated shipping address data for the customer.
   */
  shipping_address:
    CheckoutShippingResponseSchema.optional().describe('Shipping address.'),
  /**
   * Note added to the order by the customer during checkout.
   */
  customer_note: z
    .string()
    .optional()
    .describe('Note added to the order by the customer during checkout.'),
  /**
   * The ID of the payment method. Any gateway enabled on the store is valid,
   * so this is not an enum (WC's schema only lists the gateways enabled on
   * the site it was generated from).
   */
  payment_method: z
    .string()
    .optional()
    .describe(
      'The ID of the payment method being used to process the payment.'
    ),
  /**
   * Data to pass through to the payment method when processing payment,
   * e.g. a Stripe payment method ID or a save-card flag.
   */
  payment_data: z
    .array(
      z.looseObject({
        key: z.string(),
        value: z.union([z.string(), z.boolean()]),
      })
    )
    .optional()
    .describe(
      'Data to pass through to the payment method when processing payment.'
    ),
  additional_fields: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Additional fields to be persisted on the order.'),
  create_account: z
    .boolean()
    .optional()
    .describe(
      'Whether to create a new user account as part of order processing.'
    ),
  customer_password: z
    .string()
    .optional()
    .describe('Customer password for new accounts, if applicable.'),
  extensions: z
    .looseObject({
      'woocommerce/order-attribution': z
        .looseObject({
          referrer: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: referrer'),
          session_count: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: session_count'),
          session_entry: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: session_entry'),
          session_pages: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: session_pages'),
          session_start_time: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: session_start_time'),
          source_type: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: source_type'),
          user_agent: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: user_agent'),
          utm_campaign: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_campaign'),
          utm_content: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_content'),
          utm_creative_format: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_creative_format'),
          utm_id: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_id'),
          utm_marketing_tactic: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_marketing_tactic'),
          utm_medium: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_medium'),
          utm_source: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_source'),
          utm_source_platform: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_source_platform'),
          utm_term: z
            .string()
            .nullable()
            .optional()
            .describe('Order attribution field: utm_term'),
        })
        .nullable()
        .optional()
        .describe('Extension data registered by woocommerce/order-attribution'),
    })
    .optional(),
});

export type CheckoutCreateRequest = z.input<typeof CheckoutCreateRequestSchema>;
