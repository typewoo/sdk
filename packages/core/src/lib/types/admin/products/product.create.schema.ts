import { z } from 'zod';
import {
  AdminProductMetaData,
  AdminProductImage,
  AdminProductDimensions,
} from './product.js';
import {
  AdminProductAttributeSchema,
  AdminProductDefaultAttributeSchema,
  AdminDownloadableFileSchema,
} from './product.schema.js';

/**
 * Product request parameters for POST /products (create). WooCommerce
 * requires `name` and `type` to create a product.
 */
export const AdminProductCreateRequestSchema = z.looseObject({
  name: z.string().optional().describe('Product name.'),
  slug: z.string().optional().describe('Product slug.'),
  type: z
    .enum(['simple', 'grouped', 'external', 'variable'])
    .default('simple')
    .optional()
    .describe('Product type.'),
  status: z
    .enum([
      'auto-draft',
      'draft',
      'future',
      'pending',
      'private',
      'publish',
      'trash',
    ])
    .default('publish')
    .optional()
    .describe('Product status (post status).'),
  featured: z.boolean().default(false).optional().describe('Featured product.'),
  catalog_visibility: z
    .enum(['visible', 'catalog', 'search', 'hidden'])
    .default('visible')
    .optional()
    .describe('Catalog visibility.'),
  description: z.string().optional().describe('Product description.'),
  short_description: z
    .string()
    .optional()
    .describe('Product short description.'),
  sku: z.string().optional().describe('Stock Keeping Unit.'),
  regular_price: z.string().optional().describe('Product regular price.'),
  sale_price: z.string().optional().describe('Product sale price.'),
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
    .describe("End date of sale price, in the site's timezone."),
  virtual: z
    .boolean()
    .default(false)
    .optional()
    .describe('If the product is virtual.'),
  downloadable: z
    .boolean()
    .default(false)
    .optional()
    .describe('If the product is downloadable.'),
  downloads: z
    .array(AdminDownloadableFileSchema)
    .optional()
    .describe('List of downloadable files.'),
  download_limit: z
    .number()
    .default(-1)
    .optional()
    .describe(
      'Number of times downloadable files can be downloaded after purchase.'
    ),
  download_expiry: z
    .number()
    .default(-1)
    .optional()
    .describe('Number of days until access to downloadable files expires.'),
  external_url: z
    .string()
    .optional()
    .describe('Product external URL. Only for external products.'),
  button_text: z
    .string()
    .optional()
    .describe('Product external button text. Only for external products.'),
  tax_status: z
    .enum(['taxable', 'shipping', 'none'])
    .default('taxable')
    .optional()
    .describe('Tax status.'),
  tax_class: z.string().optional().describe('Tax class.'),
  manage_stock: z
    .boolean()
    .default(false)
    .optional()
    .describe('Stock management at product level.'),
  stock_quantity: z.number().optional().describe('Stock quantity.'),
  stock_status: z
    .enum(['instock', 'outofstock', 'onbackorder'])
    .default('instock')
    .optional()
    .describe('Controls the stock status of the product.'),
  backorders: z
    .enum(['no', 'notify', 'yes'])
    .default('no')
    .optional()
    .describe('If managing stock, this controls if backorders are allowed.'),
  low_stock_amount: z
    .number()
    .nullable()
    .optional()
    .describe('Low Stock amount for the product.'),
  sold_individually: z
    .boolean()
    .default(false)
    .optional()
    .describe('Allow one item to be bought in a single order.'),
  weight: z.string().optional().describe('Product weight (lbs).'),
  dimensions: AdminProductDimensions.optional().describe('Product dimensions.'),
  shipping_class: z.string().optional().describe('Shipping class slug.'),
  reviews_allowed: z
    .boolean()
    .default(true)
    .optional()
    .describe('Allow reviews.'),
  upsell_ids: z
    .array(z.number())
    .optional()
    .describe('List of up-sell products IDs.'),
  cross_sell_ids: z
    .array(z.number())
    .optional()
    .describe('List of cross-sell products IDs.'),
  parent_id: z.number().optional().describe('Product parent ID.'),
  purchase_note: z
    .string()
    .optional()
    .describe('Optional note to send the customer after purchase.'),
  categories: z
    .array(z.object({ id: z.number() }))
    .optional()
    .describe('List of categories.'),
  tags: z
    .array(z.object({ id: z.number() }))
    .optional()
    .describe('List of tags.'),
  brands: z
    .array(z.object({ id: z.number() }))
    .optional()
    .describe('List of brands.'),
  images: z.array(AdminProductImage).optional().describe('List of images.'),
  attributes: z
    .array(AdminProductAttributeSchema)
    .optional()
    .describe('List of attributes.'),
  default_attributes: z
    .array(AdminProductDefaultAttributeSchema)
    .optional()
    .describe('Defaults variation attributes.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort products.'),
  meta_data: z.array(AdminProductMetaData).optional().describe('Meta data.'),
  date_created: z
    .string()
    .nullable()
    .optional()
    .describe("The date the product was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .nullable()
    .optional()
    .describe('The date the product was created, as GMT.'),
  global_unique_id: z.string().optional().describe('GTIN, UPC, EAN or ISBN.'),
  post_password: z.string().optional().describe('Post password.'),
});

export type AdminProductCreateRequest = z.input<
  typeof AdminProductCreateRequestSchema
>;
