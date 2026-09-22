import { z } from 'zod';

/**
 * Setting request parameters for PUT /settings/{group}/{id}. WooCommerce
 * settings are pre-defined by the platform, so only update is supported.
 */
export const AdminSettingUpdateRequestSchema = z.looseObject({
  value: z
    .union([z.string(), z.number(), z.boolean(), z.null()])
    .optional()
    .describe('Setting value.'),
  group: z.string().optional().describe('Settings group ID.'),
  id: z.string().optional().describe('Unique identifier for the resource.'),
});

export type AdminSettingUpdateRequest = z.input<
  typeof AdminSettingUpdateRequestSchema
>;
