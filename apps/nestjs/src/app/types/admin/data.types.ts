import {
  AdminCountrySchema,
  AdminCurrencySchema,
  AdminContinentSchema,
  AdminDataQueryParamsSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminCountry extends createZodDto(AdminCountrySchema) {}
export class ApiAdminCurrency extends createZodDto(AdminCurrencySchema) {}
export class ApiAdminContinent extends createZodDto(AdminContinentSchema) {}
export class ApiAdminDataQueryParams extends createZodDto(
  AdminDataQueryParamsSchema
) {}
