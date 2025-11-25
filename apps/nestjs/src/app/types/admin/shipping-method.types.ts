import {
  AdminShippingMethodSchema,
  AdminShippingMethodQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminShippingMethod extends createZodDto(
  AdminShippingMethodSchema
) {}
export class ApiAdminShippingMethodQueryParams extends createZodDto(
  AdminShippingMethodQueryParamsSchema
) {}
