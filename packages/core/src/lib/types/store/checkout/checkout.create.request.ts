import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.response.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.js';

export const CheckoutCreateRequestSchema = z.looseObject({
  /**
   * Object of updated billing address data for the customer.
   */
  billing_address: CheckoutBillingResponseSchema,
  /**
   * Object of updated shipping address data for the customer.
   */
  shipping_address: CheckoutShippingResponseSchema,
  /**
   * Note added to the order by the customer during checkout.
   */
  customer_note: z.string().optional(),
  /**
   * The ID of the payment method being used to process the payment.
   */
  payment_method: z.string().optional(),
  /**
   * Data to pass through to the payment method when processing payment.
   */
  payment_data: z
    .array(
      z.looseObject({
        key: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  /**
   * Optionally define a password for new accounts.
   */
  customer_password: z.string().optional(),
  extensions: z.unknown().optional(),
});

export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;
