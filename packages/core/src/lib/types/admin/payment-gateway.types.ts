import { z } from 'zod';

export const AdminPaymentGatewaySchema = z.looseObject({
  id: z.string().describe('Payment gateway ID.'),
  title: z.string().describe('Payment gateway title on checkout.'),
  description: z.string().describe('Payment gateway description on checkout.'),
  order: z.number().describe('Payment gateway sort order.'),
  enabled: z.boolean().describe('Payment gateway enabled status.'),
  method_title: z.string().describe('Payment gateway method title.'),
  method_description: z
    .string()
    .describe('Payment gateway method description.'),
  method_supports: z
    .array(z.string())
    .describe('Supported features for this payment gateway.'),
  settings: z
    .record(
      z.string(),
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        type: z.string(),
        value: z.string(),
        default: z.string(),
        tip: z.string(),
        placeholder: z.string(),
      })
    )
    .describe('Payment gateway settings.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminPaymentGateway = z.infer<typeof AdminPaymentGatewaySchema>;

/**
 * Payment gateway request parameters for PUT /payment_gateways/{id}.
 * WooCommerce only exposes update for payment gateways — they're registered
 * by plugins, not via the REST API.
 */
export const AdminPaymentGatewayUpdateRequestSchema = z.looseObject({
  order: z.number().optional(),
  enabled: z.boolean().optional(),
  settings: z.record(z.string(), z.string()).optional(),
});

export type AdminPaymentGatewayUpdateRequest = z.input<
  typeof AdminPaymentGatewayUpdateRequestSchema
>;

export const AdminPaymentGatewayQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminPaymentGatewayQueryParams = z.infer<
  typeof AdminPaymentGatewayQueryParamsSchema
>;
