import { z } from 'zod';

/**
 * Zone method request parameters for PUT /shipping/zones/{zone}/methods/{id}.
 */
export const AdminShippingZoneMethodUpdateRequestSchema = z.looseObject({
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
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
  zone_id: z.number().optional().describe('Unique ID for the zone.'),
});

export type AdminShippingZoneMethodUpdateRequest = z.input<
  typeof AdminShippingZoneMethodUpdateRequestSchema
>;
