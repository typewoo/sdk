import { z } from 'zod';

/**
 * Shipping zone request parameters for PUT /shipping/zones/{id} (update).
 */
export const AdminShippingZoneUpdateRequestSchema = z.looseObject({
  name: z.string().optional().describe('Shipping zone name.'),
  order: z.number().optional().describe('Shipping zone order.'),
  id: z.number().optional().describe('Unique ID for the resource.'),
});

export type AdminShippingZoneUpdateRequest = z.input<
  typeof AdminShippingZoneUpdateRequestSchema
>;
