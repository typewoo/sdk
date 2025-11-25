import {
  AdminShippingZoneSchema,
  AdminShippingZoneRequestSchema,
  AdminShippingZoneQueryParamsSchema,
  AdminShippingZoneLocationSchema,
  AdminShippingZoneLocationRequestSchema,
  AdminShippingZoneMethodSchema,
  AdminShippingZoneMethodRequestSchema,
  AdminShippingZoneMethodQueryParamsSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminShippingZone extends createZodDto(
  AdminShippingZoneSchema
) {}
export class ApiAdminShippingZoneRequest extends createZodDto(
  AdminShippingZoneRequestSchema
) {}
export class ApiAdminShippingZoneQueryParams extends createZodDto(
  AdminShippingZoneQueryParamsSchema
) {}
export class ApiAdminShippingZoneLocation extends createZodDto(
  AdminShippingZoneLocationSchema
) {}
export class ApiAdminShippingZoneLocationRequest extends createZodDto(
  AdminShippingZoneLocationRequestSchema
) {}
export class ApiAdminShippingZoneMethod extends createZodDto(
  AdminShippingZoneMethodSchema
) {}
export class ApiAdminShippingZoneMethodRequest extends createZodDto(
  AdminShippingZoneMethodRequestSchema
) {}
export class ApiAdminShippingZoneMethodQueryParams extends createZodDto(
  AdminShippingZoneMethodQueryParamsSchema
) {}
