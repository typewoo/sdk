import { z } from 'zod';
import { AdminSettingsMapSchema } from '../settings-map.schema.js';

export const AdminShippingZoneMethodSchema = z.looseObject({
  instance_id: z.number().describe('Shipping method instance ID.'),
  id: z.number().optional().describe('Shipping method instance ID.'),
  title: z.string().describe('Shipping method customer facing title.'),
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  method_id: z.string().describe('Shipping method ID.'),
  method_title: z.string().describe('Shipping method title.'),
  method_description: z.string().describe('Shipping method description.'),
  settings: AdminSettingsMapSchema.optional().describe(
    'Shipping method settings, keyed by setting ID.'
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneMethod = z.infer<
  typeof AdminShippingZoneMethodSchema
>;
