import { z } from 'zod';

export const AdminSettingSchema = z.looseObject({
  id: z.string(),
  label: z.string(),
  description: z.string(),
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
  ]),
  default: z.union([z.string(), z.number(), z.boolean()]),
  tip: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
  options: z.record(z.string(), z.string()).optional(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSetting = z.infer<typeof AdminSettingSchema>;

export const AdminSettingRequestSchema = z.looseObject({
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export type AdminSettingRequest = z.infer<typeof AdminSettingRequestSchema>;

export const AdminSettingGroupSchema = z.looseObject({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  parent_id: z.string(),
  sub_groups: z.array(z.string()),
  _links: z.object({
    options: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSettingGroup = z.infer<typeof AdminSettingGroupSchema>;
