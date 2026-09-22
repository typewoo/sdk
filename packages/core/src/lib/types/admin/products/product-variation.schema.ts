import { z } from 'zod';
import { AdminMetaDataInputSchema } from '../meta-data.schema.js';
import { AdminProductDimensions } from './product.js';

/**
 * Variation attribute as sent in requests: the attribute (by `id` for a
 * global attribute or `name` for a custom one) and the chosen `option`.
 */
const AdminProductVariationAttributeInputSchema = z.looseObject({
  id: z.number().optional().describe('Attribute ID.'),
  name: z.string().optional().describe('Attribute name.'),
  option: z.string().optional().describe('Selected attribute term name.'),
});

/**
 * Variation image as sent in requests: an existing attachment `id`, or a
 * `src` URL to sideload.
 */
const AdminProductVariationImageInputSchema = z.looseObject({
  id: z.number().optional().describe('Image ID.'),
  src: z.string().optional().describe('Image URL.'),
  name: z.string().optional().describe('Image name.'),
  alt: z.string().optional().describe('Image alternative text.'),
});

/**
 * Downloadable file as sent in requests. Omit `id` to add a new file.
 */
const AdminProductVariationDownloadInputSchema = z.looseObject({
  id: z.string().optional().describe('File ID.'),
  name: z.string().optional().describe('File name.'),
  file: z.string().optional().describe('File URL.'),
});

const variationWritableFields = {
  description: z.string().optional().describe('Variation description.'),
  sku: z.string().optional().describe('Stock Keeping Unit.'),
  global_unique_id: z.string().optional().describe('GTIN, UPC, EAN or ISBN.'),
  regular_price: z.string().optional().describe('Variation regular price.'),
  sale_price: z.string().optional().describe('Variation sale price.'),
  date_on_sale_from: z
    .string()
    .nullable()
    .optional()
    .describe("Start date of sale price, in the site's timezone."),
  date_on_sale_from_gmt: z
    .string()
    .nullable()
    .optional()
    .describe('Start date of sale price, as GMT.'),
  date_on_sale_to: z
    .string()
    .nullable()
    .optional()
    .describe("End date of sale price, in the site's timezone."),
  date_on_sale_to_gmt: z
    .string()
    .nullable()
    .optional()
    .describe('End date of sale price, as GMT.'),
  status: z
    .enum(['draft', 'pending', 'private', 'publish'])
    .optional()
    .describe('Variation status.'),
  virtual: z.boolean().optional().describe('If the variation is virtual.'),
  downloadable: z
    .boolean()
    .optional()
    .describe('If the variation is downloadable.'),
  downloads: z
    .array(AdminProductVariationDownloadInputSchema)
    .optional()
    .describe('List of downloadable files.'),
  download_limit: z
    .number()
    .optional()
    .describe(
      'Number of times downloadable files can be downloaded after purchase.'
    ),
  download_expiry: z
    .number()
    .optional()
    .describe('Number of days until access to downloadable files expires.'),
  tax_status: z
    .enum(['taxable', 'shipping', 'none'])
    .optional()
    .describe('Tax status.'),
  tax_class: z.string().optional().describe('Tax class.'),
  manage_stock: z
    .boolean()
    .optional()
    .describe('Stock management at variation level.'),
  stock_quantity: z.number().optional().describe('Stock quantity.'),
  stock_status: z
    .enum(['instock', 'outofstock', 'onbackorder'])
    .optional()
    .describe('Controls the stock status of the variation.'),
  backorders: z
    .enum(['no', 'notify', 'yes'])
    .optional()
    .describe('If managing stock, this controls if backorders are allowed.'),
  low_stock_amount: z
    .number()
    .nullable()
    .optional()
    .describe('Low Stock amount for the variation.'),
  weight: z.string().optional().describe('Variation weight.'),
  dimensions: AdminProductDimensions.optional().describe(
    'Variation dimensions.'
  ),
  shipping_class: z.string().optional().describe('Shipping class slug.'),
  image: AdminProductVariationImageInputSchema.optional().describe(
    'Variation image data.'
  ),
  attributes: z
    .array(AdminProductVariationAttributeInputSchema)
    .optional()
    .describe('List of attributes.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort products.'),
  meta_data: z
    .array(AdminMetaDataInputSchema)
    .optional()
    .describe('Meta data.'),
};

/**
 * Request body for POST /products/{product_id}/variations.
 */
export const AdminProductVariationCreateRequestSchema = z.looseObject({
  ...variationWritableFields,
  status: variationWritableFields.status.default('publish'),
  virtual: variationWritableFields.virtual.default(false),
  downloadable: variationWritableFields.downloadable.default(false),
  download_limit: variationWritableFields.download_limit.default(-1),
  download_expiry: variationWritableFields.download_expiry.default(-1),
  tax_status: variationWritableFields.tax_status.default('taxable'),
  manage_stock: variationWritableFields.manage_stock.default(false),
  stock_status: variationWritableFields.stock_status.default('instock'),
  backorders: variationWritableFields.backorders.default('no'),
});

export type AdminProductVariationCreateRequest = z.input<
  typeof AdminProductVariationCreateRequestSchema
>;

/**
 * Request body for PUT /products/{product_id}/variations/{id}. All fields
 * optional — omitted fields keep their current value.
 */
export const AdminProductVariationUpdateRequestSchema = z.looseObject(
  variationWritableFields
);

export type AdminProductVariationUpdateRequest = z.input<
  typeof AdminProductVariationUpdateRequestSchema
>;

/**
 * Request body for POST /products/{product_id}/variations/generate, which
 * creates a variation for every combination of the product's variation
 * attributes.
 */
export const AdminProductVariationGenerateRequestSchema = z.looseObject({
  delete: z
    .boolean()
    .optional()
    .describe(
      'Also delete variations that no longer match the attribute combinations.'
    ),
  default_values: AdminProductVariationUpdateRequestSchema.optional().describe(
    'Default values for generated variations.'
  ),
  meta_data: z
    .array(AdminMetaDataInputSchema)
    .optional()
    .describe('Meta data added to every generated variation.'),
});

export type AdminProductVariationGenerateRequest = z.input<
  typeof AdminProductVariationGenerateRequestSchema
>;

/**
 * Response of POST /products/{product_id}/variations/generate.
 */
export const AdminProductVariationGenerateResponseSchema = z.looseObject({
  count: z.number().describe('Number of variations created.'),
  deleted_count: z
    .number()
    .optional()
    .describe('Number of variations deleted (only when `delete` was set).'),
});

export type AdminProductVariationGenerateResponse = z.infer<
  typeof AdminProductVariationGenerateResponseSchema
>;

/**
 * Query parameters for GET /products/{product_id}/variations.
 */
export const AdminProductVariationQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z
    .number()
    .default(1)
    .optional()
    .describe('Current page of the collection.'),
  per_page: z
    .number()
    .default(10)
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published after a given ISO8601 compliant date.'
    ),
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources published before a given ISO8601 compliant date.'
    ),
  modified_after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources modified after a given ISO8601 compliant date.'
    ),
  modified_before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources modified before a given ISO8601 compliant date.'
    ),
  dates_are_gmt: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'Whether to consider GMT post dates when limiting response by published or modified date.'
    ),
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum(['date', 'id', 'include', 'menu_order', 'modified', 'slug', 'title'])
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  parent: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to those of particular parent IDs.'),
  parent_exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe(
      'Limit result set to all items except those of a particular parent ID.'
    ),
  slug: z
    .string()
    .optional()
    .describe('Limit result set to products with a specific slug.'),
  status: z
    .enum(['any', 'draft', 'future', 'pending', 'private', 'publish', 'trash'])
    .default('any')
    .optional()
    .describe('Limit result set to variations assigned a specific status.'),
  include_status: z
    .array(
      z.enum([
        'any',
        'draft',
        'future',
        'pending',
        'private',
        'publish',
        'trash',
      ])
    )
    .optional()
    .describe('Limit result set to variations with any of the statuses.'),
  exclude_status: z
    .array(
      z.enum(['draft', 'future', 'pending', 'private', 'publish', 'trash'])
    )
    .optional()
    .describe('Exclude variations with any of the statuses from result set.'),
  sku: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with specific SKU(s). Use commas to separate.'
    ),
  on_sale: z
    .boolean()
    .optional()
    .describe('Limit result set to products on sale.'),
  min_price: z
    .string()
    .optional()
    .describe('Limit result set to products based on a minimum price.'),
  max_price: z
    .string()
    .optional()
    .describe('Limit result set to products based on a maximum price.'),
  stock_status: z
    .enum(['instock', 'outofstock', 'onbackorder'])
    .optional()
    .describe('Limit result set to products with specified stock status.'),
  virtual: z
    .boolean()
    .optional()
    .describe('Limit result set to virtual product variations.'),
  downloadable: z
    .boolean()
    .optional()
    .describe('Limit result set to downloadable product variations.'),
  has_price: z
    .boolean()
    .optional()
    .describe('Limit result set to products with or without price.'),
  attributes: z
    .array(
      z.looseObject({
        attribute: z.string().optional().describe('Attribute slug.'),
        term: z.string().optional().describe('Attribute term.'),
        terms: z.array(z.string()).optional().describe('Attribute terms.'),
      })
    )
    .optional()
    .describe('Limit result set to products with specified attributes.'),
  include_meta: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Limit meta_data to specific keys.'),
  exclude_meta: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Ensure meta_data excludes specific keys.'),
  pos_products_only: z
    .boolean()
    .optional()
    .describe('Limit result set to variations visible in Point of Sale.'),
});

export type AdminProductVariationQueryParams = z.input<
  typeof AdminProductVariationQueryParamsSchema
>;
