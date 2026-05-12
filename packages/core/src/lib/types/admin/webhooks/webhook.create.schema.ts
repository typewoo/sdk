import { z } from 'zod';

export const AdminWebhookCreateRequestSchema = z.looseObject({
  name: z.string().optional().describe('A friendly name for the webhook.'),
  status: z
    .enum(['active', 'paused', 'disabled'])
    .default('active')
    .optional()
    .describe('Webhook status.'),
  topic: z.string().describe('Webhook topic.'),
  secret: z
    .string()
    .optional()
    .describe(
      "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided."
    ),
  delivery_url: z.string().describe('Webhook delivery URL.'),
});

export type AdminWebhookCreateRequest = z.input<
  typeof AdminWebhookCreateRequestSchema
>;
