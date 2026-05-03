import { z } from 'zod';

export const AdminWebhookSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('A friendly name for the webhook.'),
  status: z.enum(['active', 'paused', 'disabled']).describe('Webhook status.'),
  topic: z.string().describe('Webhook topic.'),
  resource: z.string().describe('Webhook resource.'),
  event: z.string().describe('Webhook event.'),
  hooks: z.array(z.string()).describe('WooCommerce action names associated with the webhook.'),
  delivery_url: z.string().describe('The URL where the webhook payload is delivered.'),
  secret: z.string().describe('Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user\'s ID|username if not provided.'),
  date_created: z.string().describe('The date the webhook was created, in the site\'s timezone.'),
  date_created_gmt: z.string().describe('The date the webhook was created, as GMT.'),
  date_modified: z.string().describe('The date the webhook was last modified, in the site\'s timezone.'),
  date_modified_gmt: z.string().describe('The date the webhook was last modified, as GMT.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminWebhook = z.infer<typeof AdminWebhookSchema>;

/**
 * Webhook request parameters for POST /webhooks (create). WooCommerce
 * requires `topic` and `delivery_url` to register a webhook.
 */
export const AdminWebhookCreateRequestSchema = z.looseObject({
  name: z.string().optional(),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
  topic: z.string().describe('Webhook topic.'),
  secret: z.string().optional(),
  delivery_url: z
    .string()
    .describe('The URL where the webhook payload is delivered.'),
});

export type AdminWebhookCreateRequest = z.input<
  typeof AdminWebhookCreateRequestSchema
>;

/**
 * Webhook request parameters for PUT /webhooks/{id} (update).
 */
export const AdminWebhookUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  status: z.enum(['active', 'paused', 'disabled']).optional(),
  topic: z.string().optional(),
  secret: z.string().optional(),
  delivery_url: z.string().optional(),
});

export type AdminWebhookUpdateRequest = z.input<
  typeof AdminWebhookUpdateRequestSchema
>;

export const AdminWebhookQueryParamsSchema = z.looseObject({
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
