import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.schema.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.schema.js';

export const CheckoutResponseSchema = z.looseObject({
  order_id: z.number().describe('The order ID to process during checkout.'),
  status: z
    .string()
    .describe(
      'Order status. Payment providers will update this value after payment.'
    ),
  order_key: z
    .string()
    .describe(
      'Order key used to check validity or protect access to certain order data.'
    ),
  customer_note: z
    .string()
    .optional()
    .describe('Note added to the order by the customer during checkout.'),
  customer_id: z
    .number()
    .describe('Customer ID if registered. Will return 0 for guests.'),
  billing_address:
    CheckoutBillingResponseSchema.optional().describe('Billing address.'),
  shipping_address:
    CheckoutShippingResponseSchema.optional().describe('Shipping address.'),
  payment_method: z
    .enum(['', 'bacs', 'cheque', 'cod'])
    .optional()
    .describe(
      'The ID of the payment method being used to process the payment.'
    ),
  payment_result: z
    .looseObject({
      payment_status: z
        .string()
        .optional()
        .describe(
          'Status of the payment returned by the gateway. One of success, pending, failure, error.'
        ),
      payment_details: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe('An array of data being returned from the payment gateway.'),
      redirect_url: z
        .string()
        .optional()
        .describe(
          'A URL to redirect the customer after checkout. This could be, for example, a link to the payment processors website.'
        ),
    })
    .nullable()
    .optional()
    .describe('Result of payment processing, or null if not yet processed.'),
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
  order_number: z
    .string()
    .optional()
    .describe('Order number used for display.'),
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

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
