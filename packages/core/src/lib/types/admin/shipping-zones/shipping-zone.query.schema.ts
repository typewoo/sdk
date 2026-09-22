import { z } from 'zod';

export const AdminShippingZoneQueryParamsSchema = z.looseObject({});

export type AdminShippingZoneQueryParams = z.infer<
  typeof AdminShippingZoneQueryParamsSchema
>;
