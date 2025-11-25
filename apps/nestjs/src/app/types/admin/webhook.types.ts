import {
  AdminWebhookSchema,
  AdminWebhookRequestSchema,
  AdminWebhookQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
export type AdminWebhook = z.infer<typeof AdminWebhookSchema>;
export class ApiAdminWebhook extends createZodDto(AdminWebhookSchema) {}
export class ApiAdminWebhookRequest extends createZodDto(
  AdminWebhookRequestSchema
) {}
export class ApiAdminWebhookQueryParams extends createZodDto(
  AdminWebhookQueryParamsSchema
) {}
