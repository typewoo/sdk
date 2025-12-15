import { z } from 'zod';
import { CheckoutBillingResponseSchema } from './checkout.billing.response.js';
import { CheckoutShippingResponseSchema } from './checkout.shipping.js';

export const CheckoutResponseSchema = z.looseObject({
  order_id: z.number(),
  status: z.string(),
  order_key: z.string(),
  customer_note: z.string(),
  customer_id: z.number(),
  billing_address: CheckoutBillingResponseSchema,
  shipping_address: CheckoutShippingResponseSchema,
  payment_method: z.string(),
  payment_result: z.looseObject({
    payment_status: z.string(),
    payment_details: z.array(z.unknown()),
    redirect_url: z.string(),
  }),
  additional_fields: z.array(z.record(z.string(), z.string())),
  __experimentalCart: z.unknown(),
  extensions: z.unknown(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
