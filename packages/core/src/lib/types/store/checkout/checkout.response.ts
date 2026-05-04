import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.response.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.js';

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
    .string()
    .optional()
    .describe(
      'The ID of the payment method being used to process the payment.'
    ),
  payment_result: z
    .looseObject({
      payment_status: z.string(),
      payment_details: z.array(z.unknown()),
      redirect_url: z.string(),
    })
    .nullable()
    .describe('Result of payment processing, or null if not yet processed.'),
  additional_fields: z
    .array(z.record(z.string(), z.string()))
    .optional()
    .describe('Additional fields to be persisted on the order.'),
  extensions: z.unknown().optional(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
