import { z } from 'zod';

/**
 * Zone method request parameters for PUT /shipping/zones/{zone}/methods/{id}.
 */
export const AdminShippingZoneMethodUpdateRequestSchema = z.looseObject({
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  settings: z
    .record(z.string(), z.string())
    .optional()
    .describe('Shipping method settings.'),
});

export type AdminShippingZoneMethodUpdateRequest = z.input<
  typeof AdminShippingZoneMethodUpdateRequestSchema
>;
