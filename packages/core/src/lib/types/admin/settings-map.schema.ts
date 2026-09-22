import { z } from 'zod';

/**
 * One configurable setting of a payment gateway or shipping method, as
 * returned in their `settings` maps.
 */
export const AdminSettingsFieldSchema = z.looseObject({
  id: z.string().optional().describe('A unique identifier for the setting.'),
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
  /**
   * Input type, e.g. `text`, `safe_text`, `select`, `multiselect` or
   * `checkbox`. Extensions can register their own, so this is not an enum.
   */
  type: z.string().optional().describe('Type of setting.'),
  value: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Setting value (an array for multiselect settings).'),
  default: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Default value for the setting.'),
  tip: z
    .string()
    .optional()
    .describe('Additional help text shown to the user about the setting.'),
  placeholder: z
    .string()
    .optional()
    .describe('Placeholder text to be displayed in text inputs.'),
  /**
   * Choices for select and multiselect settings: value → label, or an
   * option group's label → its own value → label map (e.g. COD's
   * `enable_for_methods` groups shipping methods by type).
   */
  options: z
    .record(z.string(), z.union([z.string(), z.record(z.string(), z.string())]))
    .optional()
    .describe('Choices for select and multiselect settings, keyed by value.'),
});

export type AdminSettingsField = z.infer<typeof AdminSettingsFieldSchema>;

/**
 * Settings of a payment gateway or shipping method, keyed by setting ID
 * (e.g. `title`, `cost`, `tax_status`). WooCommerce's published schema
 * describes a single setting here instead of the map it returns.
 */
export const AdminSettingsMapSchema = z.record(
  z.string(),
  AdminSettingsFieldSchema
);

export type AdminSettingsMap = z.infer<typeof AdminSettingsMapSchema>;
