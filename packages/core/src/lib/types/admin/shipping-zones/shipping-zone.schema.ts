import { z } from 'zod';

export const AdminShippingZoneSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Shipping zone name.'),
  order: z.number().optional().describe('Shipping zone order.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describedby: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZone = z.infer<typeof AdminShippingZoneSchema>;
