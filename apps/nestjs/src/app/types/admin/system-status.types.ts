import {
  AdminSystemStatusSchema,
  AdminSystemStatusQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminSystemStatus extends createZodDto(
  AdminSystemStatusSchema
) {}
export class ApiAdminSystemStatusQueryParams extends createZodDto(
  AdminSystemStatusQueryParamsSchema
) {}
