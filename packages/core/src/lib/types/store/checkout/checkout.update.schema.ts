import { z } from 'zod';
import { CheckoutCreateRequestSchema } from './checkout.create.schema.js';

/**
 * Body for updating the draft checkout (`PUT /checkout`). WooCommerce
 * declares the same fields as for placing the order; the update handler
 * persists `additional_fields`, `payment_method` and `order_notes`.
 * `payment_data` only applies when placing the order, so it's left out.
 */
export const CheckoutUpdateRequestSchema = CheckoutCreateRequestSchema.omit({
  payment_data: true,
});

export type CheckoutUpdateRequest = z.input<typeof CheckoutUpdateRequestSchema>;
