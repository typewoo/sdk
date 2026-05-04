import { z } from 'zod';

export const AdminWebhookSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('A friendly name for the webhook.'),
  status: z
    .enum(['active', 'paused', 'disabled'])
    .default('active')
    .optional()
    .describe('Webhook status.'),
  topic: z.string().optional().describe('Webhook topic.'),
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
    .optional()
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
