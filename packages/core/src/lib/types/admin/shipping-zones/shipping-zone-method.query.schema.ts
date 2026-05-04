import { z } from 'zod';

export const AdminShippingZoneMethodQueryParamsSchema = z.looseObject({});

export type AdminShippingZoneMethodQueryParams = z.infer<
  typeof AdminShippingZoneMethodQueryParamsSchema
>;
