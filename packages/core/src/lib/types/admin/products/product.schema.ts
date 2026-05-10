import { z } from 'zod';
import {
  AdminProductMetaData,
  AdminProductImage,
  AdminProductDimensions,
} from './product.js';

/**
 * Product category reference in product
 */
export const AdminProductCategorySchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductCategory = z.infer<typeof AdminProductCategorySchema>;

/**
 * Product tag reference in product
 */
export const AdminProductTagSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductTag = z.infer<typeof AdminProductTagSchema>;

/**
 * Product brand reference in product
 */
export const AdminProductBrandSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductBrand = z.infer<typeof AdminProductBrandSchema>;

/**
 * Product attribute in product
 */
export const AdminProductAttributeSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  position: z.number(),
  visible: z.boolean(),
  variation: z.boolean(),
  options: z.array(z.string()),
});

export type AdminProductAttribute = z.infer<typeof AdminProductAttributeSchema>;

/**
 * Product default attribute for variations
 */
export const AdminProductDefaultAttributeSchema = z.looseObject({
  id: z.number(),
  name: z.string(),
  option: z.string(),
});

export type AdminProductDefaultAttribute = z.infer<
  typeof AdminProductDefaultAttributeSchema
>;

/**
 * Downloadable file
 */
export const AdminDownloadableFileSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  file: z.string(),
});

export type AdminDownloadableFile = z.infer<typeof AdminDownloadableFileSchema>;

/**
 * WooCommerce REST API Product Response
 */
export const AdminProductSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().optional().describe('Product name.'),
  slug: z.string().optional().describe('Product slug.'),
  permalink: z.string().describe('Product URL.'),
  date_created: z
    .string()
    .optional()
    .describe("The date the product was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .optional()
    .describe('The date the product was created, as GMT.'),
  date_modified: z
    .string()
    .describe(
      "The date the product was last modified, in the site's timezone."
    ),
  date_modified_gmt: z
    .string()
    .describe('The date the product was last modified, as GMT.'),
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
  global_unique_id: z.string().optional().describe('GTIN, UPC, EAN or ISBN.'),
  price: z.string().describe('Current product price.'),
  regular_price: z.string().optional().describe('Product regular price.'),
  sale_price: z.string().optional().describe('Product sale price.'),
  date_on_sale_from: z
    .string()
    .nullish()
    .describe("Start date of sale price, in the site's timezone."),
  date_on_sale_from_gmt: z
    .string()
    .nullish()
    .describe('Start date of sale price, as GMT.'),
  date_on_sale_to: z
    .string()
    .nullish()
    .describe("End date of sale price, in the site's timezone."),
  date_on_sale_to_gmt: z
    .string()
    .nullish()
    .describe("End date of sale price, in the site's timezone."),
  price_html: z.string().describe('Price formatted in HTML.'),
  on_sale: z.boolean().describe('Shows if the product is on sale.'),
  purchasable: z.boolean().describe('Shows if the product can be bought.'),
  total_sales: z.number().describe('Amount of sales.'),
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
  stock_quantity: z.number().nullable().optional().describe('Stock quantity.'),
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
  backorders_allowed: z.boolean().describe('Shows if backorders are allowed.'),
  backordered: z.boolean().describe('Shows if the product is on backordered.'),
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
  shipping_required: z
    .boolean()
    .describe('Shows if the product need to be shipped.'),
  shipping_taxable: z
    .boolean()
    .describe('Shows whether or not the product shipping is taxable.'),
  shipping_class: z.string().optional().describe('Shipping class slug.'),
  shipping_class_id: z
    .union([z.number(), z.string()])
    .describe('Shipping class ID.'),
  reviews_allowed: z
    .boolean()
    .default(true)
    .optional()
    .describe('Allow reviews.'),
  average_rating: z.string().describe('Reviews average rating.'),
  rating_count: z.number().describe('Amount of reviews that the product have.'),
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
    .array(AdminProductCategorySchema)
    .optional()
    .describe('List of categories.'),
  tags: z.array(AdminProductTagSchema).optional().describe('List of tags.'),
  brands: z
    .array(AdminProductBrandSchema)
    .optional()
    .describe('List of brands.'), // Optional, depends on plugins
  images: z.array(AdminProductImage).optional().describe('List of images.'),
  attributes: z
    .array(AdminProductAttributeSchema)
    .optional()
    .describe('List of attributes.'),
  default_attributes: z
    .array(AdminProductDefaultAttributeSchema)
    .optional()
    .describe('Defaults variation attributes.'),
  variations: z.array(z.number()).describe('List of variations IDs.'),
  grouped_products: z
    .array(z.number())
    .describe('List of grouped products ID.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort products.'),
  meta_data: z.array(AdminProductMetaData).optional().describe('Meta data.'),
  generated_slug: z
    .string()
    .optional()
    .describe('Slug automatically generated from the product name.'),
  has_options: z
    .boolean()
    .optional()
    .describe(
      'Shows if the product needs to be configured before it can be bought.'
    ),
  permalink_template: z
    .string()
    .optional()
    .describe('Permalink template for the product.'),
  post_password: z.string().optional().describe('Post password.'),
  related_ids: z
    .array(z.number())
    .optional()
    .describe('List of related products IDs.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProduct = z.infer<typeof AdminProductSchema>;

/**
 * Product variation for variable products
 */
export const AdminProductVariationSchema = z.looseObject({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  description: z.string().describe('Product description.'),
  permalink: z.string(),
  sku: z.string().describe('Stock Keeping Unit.'),
  price: z.string(),
  regular_price: z.string().describe('Product regular price.'),
  sale_price: z.string().describe('Product sale price.'),
  date_on_sale_from: z
    .string()
    .nullable()
    .describe("Start date of sale price, in the site's timezone."),
  date_on_sale_from_gmt: z
    .string()
    .nullable()
    .describe('Start date of sale price, as GMT.'),
  date_on_sale_to: z
    .string()
    .nullable()
    .describe("End date of sale price, in the site's timezone."),
  date_on_sale_to_gmt: z
    .string()
    .nullable()
    .describe("End date of sale price, in the site's timezone."),
  on_sale: z.boolean().describe('Shows if the product is on sale.'),
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
    .describe('Product status (post status).'),
  purchasable: z.boolean(),
  virtual: z.boolean().describe('If the product is virtual.'),
  downloadable: z.boolean().describe('If the product is downloadable.'),
  downloads: z
    .array(AdminDownloadableFileSchema)
    .describe('List of downloadable files.'),
  download_limit: z
    .number()
    .describe(
      'Number of times downloadable files can be downloaded after purchase.'
    ),
  download_expiry: z
    .number()
    .describe('Number of days until access to downloadable files expires.'),
  tax_status: z.enum(['taxable', 'shipping', 'none']).describe('Tax status.'),
  tax_class: z.string().describe('Tax class.'),
  manage_stock: z.boolean().describe('Stock management at product level.'),
  stock_quantity: z.number().nullable().describe('Stock quantity.'),
  stock_status: z
    .enum(['instock', 'outofstock', 'onbackorder'])
    .describe('Controls the stock status of the product.'),
  backorders: z
    .enum(['no', 'notify', 'yes'])
    .describe('If managing stock, this controls if backorders are allowed.'),
  backorders_allowed: z.boolean(),
  backordered: z.boolean(),
  low_stock_amount: z
    .number()
    .nullable()
    .describe('Low Stock amount for the product.'),
  weight: z.string().describe('Product weight (lbs).'),
  dimensions: AdminProductDimensions.describe('Product dimensions.'),
  shipping_class: z.string().describe('Shipping class slug.'),
  shipping_class_id: z.string(),
  image: AdminProductImage,
  attributes: z
    .array(AdminProductDefaultAttributeSchema)
    .describe('List of attributes.'),
  menu_order: z.number().describe('Menu order, used to custom sort products.'),
  meta_data: z.array(AdminProductMetaData).describe('Meta data.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductVariation = z.infer<typeof AdminProductVariationSchema>;
