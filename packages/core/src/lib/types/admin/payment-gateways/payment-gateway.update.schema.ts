import { z } from 'zod';

/**
 * Payment gateway request parameters for PUT /payment_gateways/{id}.
 * WooCommerce only exposes update for payment gateways — they're registered
 * by plugins, not via the REST API.
 */
export const AdminPaymentGatewayUpdateRequestSchema = z.looseObject({
  title: z.string().optional().describe('Payment gateway title on checkout.'),
  description: z
    .string()
    .optional()
    .describe('Payment gateway description on checkout.'),
  order: z.number().optional().describe('Payment gateway sort order.'),
  enabled: z.boolean().optional().describe('Payment gateway enabled status.'),
  /**
   * Setting values keyed by setting ID, e.g. `{ title: 'Card', testmode: 'yes' }`.
   * Multiselect settings take an array, e.g. COD's
   * `enable_for_methods: ['flat_rate', 'local_pickup']`.
   */
  settings: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional()
    .describe('Payment gateway settings.'),
});

export type AdminPaymentGatewayUpdateRequest = z.input<
  typeof AdminPaymentGatewayUpdateRequestSchema
>;
