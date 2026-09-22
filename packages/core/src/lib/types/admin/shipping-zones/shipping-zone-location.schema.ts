import { z } from 'zod';

const LocationTypeSchema = z.enum([
  'postcode',
  'state',
  'country',
  'continent',
]);

export const AdminShippingZoneLocationSchema = z.looseObject({
  code: z.string().optional().describe('Shipping zone location code.'),
  type: LocationTypeSchema.optional().describe('Shipping zone location type.'),
  _links: z.object({
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneLocation = z.infer<
  typeof AdminShippingZoneLocationSchema
>;

/**
 * One location in the array body of `PUT /shipping/zones/{id}/locations`,
 * which replaces all of the zone's locations.
 */
export const AdminShippingZoneLocationRequestSchema = z.looseObject({
  code: z.string().describe('Shipping zone location code.'),
  /** WC uses `country` when omitted. */
  type: LocationTypeSchema.optional().describe('Shipping zone location type.'),
});

export type AdminShippingZoneLocationRequest = z.input<
  typeof AdminShippingZoneLocationRequestSchema
>;
