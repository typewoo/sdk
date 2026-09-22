import { z } from 'zod';

export const AdminShippingZoneMethodSchema = z.looseObject({
  instance_id: z.number().describe('Shipping method instance ID.'),
  id: z.number().optional().describe('Shipping method instance ID.'),
  title: z.string().describe('Shipping method customer facing title.'),
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  method_id: z.string().describe('Shipping method ID.'),
  method_title: z.string().describe('Shipping method title.'),
  method_description: z.string().describe('Shipping method description.'),
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
          'class',
          'color',
          'email',
          'image_width',
          'multiselect',
          'number',
          'order',
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
    .describe('Shipping method settings.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneMethod = z.infer<
  typeof AdminShippingZoneMethodSchema
>;
