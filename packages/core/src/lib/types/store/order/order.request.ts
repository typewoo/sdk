import { z } from 'zod';
import { OrderBillingResponseSchema } from './order.billing.response.js';
import { OrderShippingResponseSchema } from './order.shipping.response.js';

export const OrderRequestSchema = z.looseObject({
  /**
   * The key for the order verification.
   */
  key: z.string(),
  /**
   * The email address used to verify guest orders.
   */
  billing_email: z.string().optional(),
  /**
   * Object of updated billing address data for the customer.
   */
  billing_address: OrderBillingResponseSchema,
  /**
   * Object of updated shipping address data for the customer.
   */
  shipping_address: OrderShippingResponseSchema,
  /**
   * The ID of the payment method being used to process the payment.
   */
  payment_method: z.string(),
  /**
   * Data to pass through to the payment method when processing payment.
   */
  payment_data: z
    .array(
      z.looseObject({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

export type OrderRequest = z.infer<typeof OrderRequestSchema>;
