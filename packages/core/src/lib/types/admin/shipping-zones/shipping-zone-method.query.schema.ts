import { z } from 'zod';

export const AdminShippingZoneMethodQueryParamsSchema = z.looseObject({
  zone_id: z.number().optional().describe('Unique ID for the zone.'),
});

export type AdminShippingZoneMethodQueryParams = z.infer<
  typeof AdminShippingZoneMethodQueryParamsSchema
>;
