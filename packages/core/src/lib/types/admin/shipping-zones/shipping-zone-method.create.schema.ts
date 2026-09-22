import { z } from 'zod';

/**
 * Zone method request parameters for POST /shipping/zones/{zone}/methods.
 * WooCommerce requires `method_id` to register a method on a zone.
 */
export const AdminShippingZoneMethodCreateRequestSchema = z.looseObject({
  method_id: z.string().describe('Shipping method ID.'),
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

export type AdminShippingZoneMethodCreateRequest = z.input<
  typeof AdminShippingZoneMethodCreateRequestSchema
>;
