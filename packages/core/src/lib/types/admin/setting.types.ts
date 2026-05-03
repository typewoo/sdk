import { z } from 'zod';

export const AdminSettingSchema = z.looseObject({
  id: z.string().describe('A unique identifier for the setting.'),
  label: z.string().describe('A human readable label for the setting used in interfaces.'),
  description: z.string().describe('A human readable description for the setting used in interfaces.'),
  type: z.enum([
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
  ]).describe('Type of setting.'),
  default: z.union([z.string(), z.number(), z.boolean()]).describe('Default value for the setting.'),
  tip: z.string().describe('Additional help text shown to the user about the setting.'),
  value: z.union([z.string(), z.number(), z.boolean()]).describe('Setting value.'),
  options: z.record(z.string(), z.string()).optional().describe('Array of options (key value pairs) for inputs such as select, multiselect, and radio buttons.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSetting = z.infer<typeof AdminSettingSchema>;

/**
 * Setting request parameters for PUT /settings/{group}/{id}. WooCommerce
 * settings are pre-defined by the platform, so only update is supported.
 */
export const AdminSettingUpdateRequestSchema = z.looseObject({
  value: z
    .union([z.string(), z.number(), z.boolean()])
    .describe('Setting value.'),
});

export type AdminSettingUpdateRequest = z.input<
  typeof AdminSettingUpdateRequestSchema
>;

export const AdminSettingGroupSchema = z.looseObject({
  id: z.string().describe('A unique identifier that can be used to link settings together.'),
  label: z.string().describe('A human readable label for the setting used in interfaces.'),
  description: z.string().describe('A human readable description for the setting used in interfaces.'),
  parent_id: z.string().describe('ID of parent grouping.'),
  sub_groups: z.array(z.string()).describe('IDs for settings sub groups.'),
  _links: z.object({
    options: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSettingGroup = z.infer<typeof AdminSettingGroupSchema>;
