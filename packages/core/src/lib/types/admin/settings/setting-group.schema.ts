import { z } from 'zod';

export const AdminSettingGroupSchema = z.looseObject({
  id: z
    .string()
    .optional()
    .describe(
      'A unique identifier that can be used to link settings together.'
    ),
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
  parent_id: z.string().optional().describe('ID of parent grouping.'),
  sub_groups: z
    .array(z.string())
    .optional()
    .describe('IDs for settings sub groups.'),
  _links: z.object({
    options: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminSettingGroup = z.infer<typeof AdminSettingGroupSchema>;
