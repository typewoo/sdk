import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AdminWebhookSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['active', 'paused', 'disabled']),
  topic: z.string(),
  resource: z.string(),
  event: z.string(),
  hooks: z.array(z.string()),
  delivery_url: z.string(),
  secret: z.string(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminWebhook = z.infer<typeof AdminWebhookSchema>;
export class ApiAdminWebhook extends createZodDto(AdminWebhookSchema) {}

export const AdminWebhookRequestSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
  topic: z.string().optional(),
  secret: z.string().optional(),
  delivery_url: z.string().optional(),
});

export type AdminWebhookRequest = z.infer<typeof AdminWebhookRequestSchema>;
export class ApiAdminWebhookRequest extends createZodDto(
  AdminWebhookRequestSchema
) {}

export const AdminWebhookQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z.enum(['date', 'id', 'title']).optional(),
  status: z.enum(['all', 'active', 'paused', 'disabled']).optional(),
});

export type AdminWebhookQueryParams = z.infer<
  typeof AdminWebhookQueryParamsSchema
>;
export class ApiAdminWebhookQueryParams extends createZodDto(
  AdminWebhookQueryParamsSchema
) {}
