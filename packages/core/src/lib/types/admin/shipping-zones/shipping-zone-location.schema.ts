import { z } from 'zod';

export const AdminShippingZoneLocationSchema = z.looseObject({
  code: z.string(),
  type: z.enum(['postcode', 'state', 'country', 'continent']),
  _links: z.object({
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneLocation = z.infer<
  typeof AdminShippingZoneLocationSchema
>;

export const AdminShippingZoneLocationRequestSchema = z.looseObject({
  code: z.string(),
  type: z.enum(['postcode', 'state', 'country', 'continent']),
});

export type AdminShippingZoneLocationRequest = z.infer<
  typeof AdminShippingZoneLocationRequestSchema
>;
