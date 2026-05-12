import { z } from 'zod';

/**
 * Payment gateway request parameters for PUT /payment_gateways/{id}.
 * WooCommerce only exposes update for payment gateways — they're registered
 * by plugins, not via the REST API.
 */
export const AdminPaymentGatewayUpdateRequestSchema = z.looseObject({
  order: z.number().optional(),
  enabled: z.boolean().optional(),
  settings: z.record(z.string(), z.string()).optional(),
});

export type AdminPaymentGatewayUpdateRequest = z.input<
  typeof AdminPaymentGatewayUpdateRequestSchema
>;
