import { z } from 'zod';

export const AdminPaymentGatewaySchema = z.looseObject({
  id: z.string().describe('Payment gateway ID.'),
  title: z.string().optional().describe('Payment gateway title on checkout.'),
  description: z
    .string()
    .optional()
    .describe('Payment gateway description on checkout.'),
  order: z.number().optional().describe('Payment gateway sort order.'),
  enabled: z.boolean().optional().describe('Payment gateway enabled status.'),
  method_title: z.string().describe('Payment gateway method title.'),
  method_description: z
    .string()
    .describe('Payment gateway method description.'),
  method_supports: z
    .array(z.string())
    .describe('Supported features for this payment gateway.'),
  settings: z
    .looseObject({
      id: z
        .string()
        .optional()
        .describe('A unique identifier for the setting.'),
      label: z
        .string()
        .optional()
        .describe('A human readable label for the setting used in interfaces.'),
      description: z
        .string()
        .optional()
        .describe(
          'A human readable description for the setting used in interfaces.'
        ),
      type: z
        .enum([
          'checkbox',
          'color',
          'email',
          'image_width',
          'multiselect',
          'number',
          'password',
          'radio',
          'select',
          'text',
          'textarea',
        ])
        .optional()
        .describe('Type of setting.'),
      value: z.string().optional().describe('Setting value.'),
      default: z.string().optional().describe('Default value for the setting.'),
      tip: z
        .string()
        .optional()
        .describe('Additional help text shown to the user about the setting.'),
      placeholder: z
        .string()
        .optional()
        .describe('Placeholder text to be displayed in text inputs.'),
    })
    .optional()
    .describe('Payment gateway settings.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminPaymentGateway = z.infer<typeof AdminPaymentGatewaySchema>;
