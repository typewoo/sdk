import { z } from 'zod';

/**
 * Shipping zone request parameters for POST /shipping/zones (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminShippingZoneCreateRequestSchema = z.looseObject({
  name: z.string().describe('Shipping zone name.'),
  order: z.number().optional().describe('Shipping zone order.'),
});

export type AdminShippingZoneCreateRequest = z.input<
  typeof AdminShippingZoneCreateRequestSchema
>;
