import { z } from 'zod';
import { CheckoutCreateRequestSchema } from './checkout.create.schema.js';

/**
 * Body for updating the draft checkout (`PUT /checkout`). The update
 * handler persists `additional_fields`, `payment_method` and
 * `order_notes`; `payment_data` and `customer_password` only apply when
 * placing the order.
 */
export const CheckoutUpdateRequestSchema = CheckoutCreateRequestSchema.omit({
  payment_data: true,
  customer_password: true,
}).extend({
  order_notes: z.string().optional().describe('Order notes.'),
});

export type CheckoutUpdateRequest = z.input<typeof CheckoutUpdateRequestSchema>;
