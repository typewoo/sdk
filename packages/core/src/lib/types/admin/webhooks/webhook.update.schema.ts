import { z } from 'zod';

export const AdminWebhookUpdateRequestSchema = z.looseObject({
  name: z.string().optional().describe('A friendly name for the webhook.'),
  status: z
    .enum(['active', 'paused', 'disabled'])
    .optional()
    .describe('Webhook status.'),
  topic: z.string().optional().describe('Webhook topic.'),
  secret: z
    .string()
    .optional()
    .describe(
      "Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided."
    ),
  id: z.number().optional().describe('Unique identifier for the resource.'),
});

export type AdminWebhookUpdateRequest = z.input<
  typeof AdminWebhookUpdateRequestSchema
>;
