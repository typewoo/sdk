import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.response.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.js';

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
   * The ID of the payment method being used to process the payment.
   */
  payment_method: z
    .string()
    .optional()
    .describe(
      'The ID of the payment method being used to process the payment.'
    ),
  extensions: z.unknown().optional(),
});

export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;
