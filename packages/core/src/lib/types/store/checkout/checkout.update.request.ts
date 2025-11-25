import { z } from 'zod';

export const CheckoutUpdateRequestSchema = z.object({
  /**
   * Name => value pairs of additional fields to update.
   */
  additional_fields: z.array(z.record(z.string(), z.string())).optional(),
  /**
   * The ID of the payment method selected.
   */
  payment_method: z.string().optional(),
  /**
   * Order notes.
   */
  order_notes: z.string().optional(),
});

export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;
