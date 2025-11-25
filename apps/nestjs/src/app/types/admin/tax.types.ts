import {
  AdminTaxSchema,
  AdminTaxQueryParamsSchema,
  AdminTaxClassSchema,
  AdminTaxClassRequestSchema,
  AdminTaxClassQueryParamsSchema,
  AdminTaxRequestSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminTax extends createZodDto(AdminTaxSchema) {}
export class ApiAdminTaxQueryParams extends createZodDto(
  AdminTaxQueryParamsSchema
) {}
export class ApiAdminTaxClass extends createZodDto(AdminTaxClassSchema) {}
export class ApiAdminTaxRequest extends createZodDto(AdminTaxRequestSchema) {}
export class ApiAdminTaxClassRequest extends createZodDto(
  AdminTaxClassRequestSchema
) {}
export class ApiAdminTaxClassQueryParams extends createZodDto(
  AdminTaxClassQueryParamsSchema
) {}
