import { z } from 'zod';

/**
 * A meta value. WooCommerce stores arbitrary serialised PHP values, so a
 * value can be any JSON type, including arrays and objects.
 */
const AdminMetaValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.unknown()),
  z.record(z.string(), z.unknown()),
  z.null(),
]);

/**
 * A `meta_data` entry as returned by the REST API.
 */
export const AdminMetaDataSchema = z.object({
  id: z.number().describe('Meta ID.'),
  key: z.string().describe('Meta key.'),
  value: AdminMetaValueSchema.describe('Meta value.'),
});
export type AdminMetaData = z.infer<typeof AdminMetaDataSchema>;
/** @deprecated Removed in 4.0. Use `AdminMetaData`. */
export type AdminMetaDataType = AdminMetaData;

/**
 * A `meta_data` entry sent in a create or update request. `id` is only
 * needed to update an existing entry; omit it to add a new one.
 */
export const AdminMetaDataInputSchema = AdminMetaDataSchema.extend({
  id: z.number().optional().describe('Meta ID, to update an existing entry.'),
});
export type AdminMetaDataInput = z.infer<typeof AdminMetaDataInputSchema>;
