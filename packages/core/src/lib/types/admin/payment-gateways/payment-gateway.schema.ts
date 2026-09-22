import { z } from 'zod';
import { AdminSettingsMapSchema } from '../settings-map.schema.js';

export const AdminPaymentGatewaySchema = z.looseObject({
  id: z.string().describe('Payment gateway ID.'),
  title: z.string().optional().describe('Payment gateway title on checkout.'),
  description: z
    .string()
    .optional()
    .describe('Payment gateway description on checkout.'),
  order: z
    .union([z.number(), z.string()])
    .optional()
    .describe('Payment gateway sort order.'),
  enabled: z.boolean().optional().describe('Payment gateway enabled status.'),
  method_title: z.string().describe('Payment gateway method title.'),
  method_description: z
    .string()
    .describe('Payment gateway method description.'),
  method_supports: z
    .array(z.string())
    .describe('Supported features for this payment gateway.'),
  settings: AdminSettingsMapSchema.optional().describe(
    'Payment gateway settings, keyed by setting ID.'
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminPaymentGateway = z.infer<typeof AdminPaymentGatewaySchema>;
