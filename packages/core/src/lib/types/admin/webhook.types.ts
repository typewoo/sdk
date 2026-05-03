import { z } from 'zod';

export const AdminWebhookSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('A friendly name for the webhook.'),
  status: z.enum(['active', 'paused', 'disabled']).describe('Webhook status.'),
  topic: z.string().describe('Webhook topic.'),
  resource: z.string().describe('Webhook resource.'),
  event: z.string().describe('Webhook event.'),
  hooks: z
    .array(z.string())
    .describe('WooCommerce action names associated with the webhook.'),
  delivery_url: z
    .string()
    .describe('The URL where the webhook payload is delivered.'),
  secret: z
    .string()
    .describe(
      "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided."
    ),
  date_created: z
    .string()
    .describe("The date the webhook was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the webhook was created, as GMT.'),
  date_modified: z
    .string()
    .describe(
      "The date the webhook was last modified, in the site's timezone."
    ),
  date_modified_gmt: z
    .string()
    .describe('The date the webhook was last modified, as GMT.'),
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
  name: z.string().optional().describe('A friendly name for the webhook.'),
  status: z
    .enum(['active', 'paused', 'disabled'])
    .optional()
    .describe('Webhook status.'),
  topic: z.string().describe('Webhook topic.'),
  secret: z
    .string()
    .optional()
    .describe(
      "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided."
    ),
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
  name: z.string().optional().describe('A friendly name for the webhook.'),
  status: z
    .enum(['active', 'paused', 'disabled'])
    .optional()
    .describe('Webhook status.'),
  topic: z.string().optional(),
  secret: z
    .string()
    .optional()
    .describe(
      "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided."
    ),
  delivery_url: z.string().optional(),
});

export type AdminWebhookUpdateRequest = z.input<
  typeof AdminWebhookUpdateRequestSchema
>;

export const AdminWebhookQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['date', 'id', 'title'])
    .optional()
    .describe('Sort collection by object attribute.'),
  status: z
    .enum(['all', 'active', 'paused', 'disabled'])
    .optional()
    .describe('Webhook status.'),
});

export type AdminWebhookQueryParams = z.infer<
  typeof AdminWebhookQueryParamsSchema
>;
