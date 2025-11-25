import {
  AdminBrandSchema,
  AdminBrandRequestSchema,
  AdminBrandQueryParamsSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminBrand extends createZodDto(AdminBrandSchema) {}
export class ApiAdminBrandRequest extends createZodDto(
  AdminBrandRequestSchema
) {}
export class ApiAdminBrandQueryParams extends createZodDto(
  AdminBrandQueryParamsSchema
) {}
