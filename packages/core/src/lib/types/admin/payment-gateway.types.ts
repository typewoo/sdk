import { z } from 'zod';

export const AdminPaymentGatewaySchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  enabled: z.boolean(),
  method_title: z.string(),
  method_description: z.string(),
  method_supports: z.array(z.string()),
  settings: z.record(
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
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminPaymentGateway = z.infer<typeof AdminPaymentGatewaySchema>;

export const AdminPaymentGatewayRequestSchema = z.looseObject({
  order: z.number().optional(),
  enabled: z.boolean().optional(),
  settings: z.record(z.string(), z.string()).optional(),
});

export type AdminPaymentGatewayRequest = z.infer<
  typeof AdminPaymentGatewayRequestSchema
>;

export const AdminPaymentGatewayQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminPaymentGatewayQueryParams = z.infer<
  typeof AdminPaymentGatewayQueryParamsSchema
>;
