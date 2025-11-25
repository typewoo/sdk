import {
  AdminCustomerSchema,
  AdminCustomerRequestSchema,
  AdminCustomerQueryParamsSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminCustomer extends createZodDto(AdminCustomerSchema) {}
export class ApiAdminCustomerRequest extends createZodDto(
  AdminCustomerRequestSchema
) {}
export class ApiAdminCustomerQueryParams extends createZodDto(
  AdminCustomerQueryParamsSchema
) {}
