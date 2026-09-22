import { z } from 'zod';
import { AdminProductUpdateRequestSchema } from './product.update.schema.js';

/**
 * Request body for POST /products/{id}/duplicate. Same fields as a product
 * update: any value sent here overrides the copied value on the duplicate.
 */
export const AdminProductDuplicateRequestSchema =
  AdminProductUpdateRequestSchema.extend({});

export type AdminProductDuplicateRequest = z.input<
  typeof AdminProductDuplicateRequestSchema
>;

/** PHP `WC_DateTime` as serialised by `json_encode`. */
const AdminProductRawDateSchema = z.looseObject({
  date: z
    .string()
    .describe('Date and time, e.g. `2026-01-31 10:48:31.000000`.'),
  timezone_type: z.number().describe('PHP DateTime timezone type.'),
  timezone: z.string().describe('Timezone, e.g. `+00:00`.'),
});

/** PHP array: `[]` when empty, an object when it has string keys. */
const phpMap = <T extends z.ZodType>(value: T) =>
  z.union([z.array(z.unknown()), z.record(z.string(), value)]);

/**
 * Response of POST /products/{id}/duplicate.
 *
 * Unlike the other product endpoints, this returns the new product's raw
 * `WC_Product::get_data()` rather than the REST product shape: dates are
 * `WC_DateTime` objects, terms and images are ID lists (`category_ids`,
 * `image_id`), dimensions are top-level and there is no `permalink` or
 * `_links`. Fetch the product with `getById()` for the REST shape.
 */
export const AdminProductDuplicateResponseSchema = z.looseObject({
  id: z.number().describe('ID of the new (duplicated) product.'),
  name: z.string().optional().describe('Product name.'),
  slug: z
    .string()
    .optional()
    .describe('Product slug (empty until the draft is published).'),
  date_created: AdminProductRawDateSchema.nullable()
    .optional()
    .describe('Creation date.'),
  date_modified: AdminProductRawDateSchema.nullable()
    .optional()
    .describe('Last modification date.'),
  status: z
    .string()
    .optional()
    .describe('Product status; duplicates start as `draft`.'),
  featured: z.boolean().optional().describe('Featured product.'),
  catalog_visibility: z.string().optional().describe('Catalog visibility.'),
  description: z.string().optional().describe('Product description.'),
  short_description: z
    .string()
    .optional()
    .describe('Product short description.'),
  sku: z.string().optional().describe('Stock Keeping Unit.'),
  global_unique_id: z.string().optional().describe('GTIN, UPC, EAN or ISBN.'),
  price: z.string().optional().describe('Current product price.'),
  regular_price: z.string().optional().describe('Product regular price.'),
  sale_price: z.string().optional().describe('Product sale price.'),
  date_on_sale_from: AdminProductRawDateSchema.nullable()
    .optional()
    .describe('Start date of sale price.'),
  date_on_sale_to: AdminProductRawDateSchema.nullable()
    .optional()
    .describe('End date of sale price.'),
  total_sales: z.number().optional().describe('Amount of sales.'),
  tax_status: z.string().optional().describe('Tax status.'),
  tax_class: z.string().optional().describe('Tax class.'),
  manage_stock: z
    .boolean()
    .optional()
    .describe('Stock management at product level.'),
  stock_quantity: z.number().nullable().optional().describe('Stock quantity.'),
  stock_status: z.string().optional().describe('Stock status.'),
  backorders: z.string().optional().describe('Backorders setting.'),
  low_stock_amount: z
    .union([z.number(), z.string()])
    .optional()
    .describe('Low stock amount (empty string when unset).'),
  sold_individually: z
    .boolean()
    .optional()
    .describe('Allow one item to be bought in a single order.'),
  weight: z.string().optional().describe('Product weight.'),
  length: z.string().optional().describe('Product length.'),
  width: z.string().optional().describe('Product width.'),
  height: z.string().optional().describe('Product height.'),
  upsell_ids: z
    .array(z.number())
    .optional()
    .describe('List of up-sell products IDs.'),
  cross_sell_ids: z
    .array(z.number())
    .optional()
    .describe('List of cross-sell products IDs.'),
  parent_id: z.number().optional().describe('Product parent ID.'),
  reviews_allowed: z.boolean().optional().describe('Allow reviews.'),
  purchase_note: z.string().optional().describe('Purchase note.'),
  attributes: phpMap(z.unknown())
    .optional()
    .describe('Attributes keyed by attribute slug.'),
  default_attributes: phpMap(z.string())
    .optional()
    .describe('Default variation attributes keyed by attribute slug.'),
  menu_order: z.number().optional().describe('Menu order.'),
  post_password: z.string().optional().describe('Post password.'),
  virtual: z.boolean().optional().describe('If the product is virtual.'),
  downloadable: z
    .boolean()
    .optional()
    .describe('If the product is downloadable.'),
  category_ids: z.array(z.number()).optional().describe('Category IDs.'),
  tag_ids: z.array(z.number()).optional().describe('Tag IDs.'),
  brand_ids: z.array(z.number()).optional().describe('Brand IDs.'),
  shipping_class_id: z.number().optional().describe('Shipping class ID.'),
  downloads: phpMap(z.unknown())
    .optional()
    .describe('Downloadable files keyed by download ID.'),
  image_id: z
    .union([z.number(), z.string()])
    .optional()
    .describe('Main image ID (empty string when unset).'),
  gallery_image_ids: z
    .array(z.number())
    .optional()
    .describe('Gallery image IDs.'),
  download_limit: z.number().optional().describe('Download limit.'),
  download_expiry: z.number().optional().describe('Download expiry days.'),
  rating_counts: phpMap(z.number())
    .optional()
    .describe('Review counts keyed by rating.'),
  average_rating: z.string().optional().describe('Average rating.'),
  review_count: z.number().optional().describe('Review count.'),
  cogs_value: z
    .number()
    .nullable()
    .optional()
    .describe('Cost of goods sold value.'),
  meta_data: z
    .array(z.looseObject({}))
    .optional()
    .describe('Meta data (non-internal meta copied from the source).'),
});

export type AdminProductDuplicateResponse = z.infer<
  typeof AdminProductDuplicateResponseSchema
>;
