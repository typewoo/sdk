import { z } from 'zod';

export const AdminSettingSchema = z.looseObject({
  id: z.string().describe('A unique identifier for the setting.'),
  label: z
    .string()
    .describe('A human readable label for the setting used in interfaces.'),
  description: z
    .string()
    .describe(
      'A human readable description for the setting used in interfaces.'
    ),
  type: z
    .enum([
      'text',
      'email',
      'number',
      'color',
      'password',
      'textarea',
      'select',
      'multiselect',
      'radio',
      'image_width',
      'checkbox',
    ])
    .describe('Type of setting.'),
  default: z
    .union([z.string(), z.number(), z.boolean()])
    .describe('Default value for the setting.'),
  tip: z
    .string()
    .optional()
    .describe('Additional help text shown to the user about the setting.'),
  value: z
    .union([z.string(), z.number(), z.boolean()])
    .optional()
    .describe('Setting value.'),
  options: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      'Array of options (key value pairs) for inputs such as select, multiselect, and radio buttons.'
    ),
  group_id: z
    .string()
    .optional()
    .describe('An identifier for the group this setting belongs to.'),
  placeholder: z
    .string()
    .optional()
    .describe('Placeholder text to be displayed in text inputs.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSetting = z.infer<typeof AdminSettingSchema>;
