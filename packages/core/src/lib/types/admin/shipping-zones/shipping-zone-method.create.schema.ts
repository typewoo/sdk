import { z } from 'zod';

/**
 * Zone method request parameters for POST /shipping/zones/{zone}/methods.
 * WooCommerce requires `method_id` to register a method on a zone.
 */
export const AdminShippingZoneMethodCreateRequestSchema = z.looseObject({
  method_id: z.string().describe('Shipping method ID.'),
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  settings: z
    .record(z.string(), z.string())
    .optional()
    .describe('Shipping method settings.'),
});

export type AdminShippingZoneMethodCreateRequest = z.input<
  typeof AdminShippingZoneMethodCreateRequestSchema
>;
