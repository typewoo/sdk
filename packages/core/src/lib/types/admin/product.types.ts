import { z } from 'zod';

const AdminProductMetaData = z.object({
  id: z.number(),
  key: z.string(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.string(), z.unknown()),
    z.null(),
  ]),
});

const AdminProductImage = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  src: z.string(),
  name: z.string(),
  alt: z.string(),
});

const AdminProductDimensions = z.object({
  length: z.string().describe('Product length (in).'),
  width: z.string().describe('Product width (in).'),
  height: z.string().describe('Product height (in).'),
});

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
  name: z.string().describe('Product name.'),
  slug: z.string().describe('Product slug.'),
  permalink: z.string().describe('Product URL.'),
  date_created: z
    .string()
    .describe("The date the product was created, in the site's timezone."),
  date_created_gmt: z
    .string()
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
    .describe('Product type.'),
  status: z
    .enum(['draft', 'pending', 'private', 'publish'])
    .describe('Product status (post status).'),
  featured: z.boolean().describe('Featured product.'),
  catalog_visibility: z
    .enum(['visible', 'catalog', 'search', 'hidden'])
    .describe('Catalog visibility.'),
  description: z.string().describe('Product description.'),
  short_description: z.string().describe('Product short description.'),
  sku: z.string().describe('Stock Keeping Unit.'),
  global_unique_id: z.string().optional().describe('GTIN, UPC, EAN or ISBN.'),
  price: z.string().describe('Current product price.'),
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
  price_html: z.string().describe('Price formatted in HTML.'),
  on_sale: z.boolean().describe('Shows if the product is on sale.'),
  purchasable: z.boolean().describe('Shows if the product can be bought.'),
  total_sales: z.number().describe('Amount of sales.'),
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
  external_url: z
    .string()
    .describe('Product external URL. Only for external products.'),
  button_text: z
    .string()
    .describe('Product external button text. Only for external products.'),
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
  backorders_allowed: z.boolean().describe('Shows if backorders are allowed.'),
  backordered: z.boolean().describe('Shows if the product is on backordered.'),
  low_stock_amount: z
    .number()
    .nullable()
    .describe('Low Stock amount for the product.'),
  sold_individually: z
    .boolean()
    .describe('Allow one item to be bought in a single order.'),
  weight: z.string().describe('Product weight (lbs).'),
  dimensions: AdminProductDimensions,
  shipping_required: z.boolean().describe('Product dimensions.'),
  shipping_taxable: z
    .boolean()
    .describe('Shows whether or not the product shipping is taxable.'),
  shipping_class: z.string().describe('Shipping class slug.'),
  shipping_class_id: z.number().describe('Shipping class ID.'),
  reviews_allowed: z.boolean().describe('Allow reviews.'),
  average_rating: z.string().describe('Reviews average rating.'),
  rating_count: z.number().describe('Amount of reviews that the product have.'),
  upsell_ids: z.array(z.number()).describe('List of up-sell products IDs.'),
  cross_sell_ids: z
    .array(z.number())
    .describe('List of cross-sell products IDs.'),
  parent_id: z.number().describe('Product parent ID.'),
  purchase_note: z
    .string()
    .describe('Optional note to send the customer after purchase.'),
  categories: z
    .array(AdminProductCategorySchema)
    .describe('List of categories.'),
  tags: z.array(AdminProductTagSchema).describe('List of tags.'),
  brands: z
    .array(AdminProductBrandSchema)
    .optional()
    .describe('List of brands.'), // Optional, depends on plugins
  images: z.array(AdminProductImage).describe('List of images.'),
  attributes: z
    .array(AdminProductAttributeSchema)
    .describe('List of attributes.'),
  default_attributes: z
    .array(AdminProductDefaultAttributeSchema)
    .describe('Defaults variation attributes.'),
  variations: z.array(z.number()).describe('List of variations IDs.'),
  grouped_products: z
    .array(z.number())
    .describe('List of grouped products ID.'),
  menu_order: z.number().describe('Menu order, used to custom sort products.'),
  price_range: z.string().nullable(),
  meta_data: z.array(AdminProductMetaData).describe('Meta data.'),
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
  description: z.string(),
  permalink: z.string(),
  sku: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  date_on_sale_from: z.string().nullable(),
  date_on_sale_from_gmt: z.string().nullable(),
  date_on_sale_to: z.string().nullable(),
  date_on_sale_to_gmt: z.string().nullable(),
  on_sale: z.boolean(),
  status: z.enum(['publish', 'private', 'draft']),
  purchasable: z.boolean(),
  virtual: z.boolean(),
  downloadable: z.boolean(),
  downloads: z.array(AdminDownloadableFileSchema),
  download_limit: z.number(),
  download_expiry: z.number(),
  tax_status: z.enum(['taxable', 'shipping', 'none']),
  tax_class: z.string(),
  manage_stock: z.boolean(),
  stock_quantity: z.number().nullable(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']),
  backorders: z.enum(['no', 'notify', 'yes']),
  backorders_allowed: z.boolean(),
  backordered: z.boolean(),
  low_stock_amount: z.number().nullable(),
  weight: z.string(),
  dimensions: AdminProductDimensions,
  shipping_class: z.string(),
  shipping_class_id: z.number(),
  image: AdminProductImage,
  attributes: z.array(AdminProductDefaultAttributeSchema),
  menu_order: z.number(),
  meta_data: z.array(AdminProductMetaData),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductVariation = z.infer<typeof AdminProductVariationSchema>;

/**
 * Product request parameters for POST /products (create). WooCommerce
 * requires `name` and `type` to create a product.
 */
export const AdminProductCreateRequestSchema = z.looseObject({
  name: z.string().describe('Product name.'),
  slug: z.string().optional(),
  type: z
    .enum(['simple', 'grouped', 'external', 'variable'])
    .describe('Product type.'),
  status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
  featured: z.boolean().optional(),
  catalog_visibility: z
    .enum(['visible', 'catalog', 'search', 'hidden'])
    .optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().optional(),
  regular_price: z.string().optional(),
  sale_price: z.string().optional(),
  date_on_sale_from: z.string().optional(),
  date_on_sale_from_gmt: z.string().optional(),
  date_on_sale_to: z.string().optional(),
  date_on_sale_to_gmt: z.string().optional(),
  virtual: z.boolean().optional(),
  downloadable: z.boolean().optional(),
  downloads: z.array(AdminDownloadableFileSchema).optional(),
  download_limit: z.number().optional(),
  download_expiry: z.number().optional(),
  external_url: z.string().optional(),
  button_text: z.string().optional(),
  tax_status: z.enum(['taxable', 'shipping', 'none']).optional(),
  tax_class: z.string().optional(),
  manage_stock: z.boolean().optional(),
  stock_quantity: z.number().optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
  backorders: z.enum(['no', 'notify', 'yes']).optional(),
  low_stock_amount: z.number().optional(),
  sold_individually: z.boolean().optional(),
  weight: z.string().optional(),
  dimensions: AdminProductDimensions.optional(),
  shipping_class: z.string().optional(),
  reviews_allowed: z.boolean().optional(),
  upsell_ids: z.array(z.number()).optional(),
  cross_sell_ids: z.array(z.number()).optional(),
  parent_id: z.number().optional(),
  purchase_note: z.string().optional(),
  categories: z.array(z.object({ id: z.number() })).optional(),
  tags: z.array(z.object({ id: z.number() })).optional(),
  brands: z.array(z.object({ id: z.number() })).optional(),
  images: z.array(AdminProductImage).optional(),
  attributes: z.array(AdminProductAttributeSchema).optional(),
  default_attributes: z.array(AdminProductDefaultAttributeSchema).optional(),
  menu_order: z.number().optional(),
  meta_data: z.array(AdminProductMetaData).optional(),
});

export type AdminProductCreateRequest = z.input<
  typeof AdminProductCreateRequestSchema
>;

/**
 * Product request parameters for PUT /products/{id} (update). All fields
 * optional — omitted fields keep their current value.
 */
export const AdminProductUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['simple', 'grouped', 'external', 'variable']).optional(),
  status: z.enum(['draft', 'pending', 'private', 'publish']).optional(),
  featured: z.boolean().optional(),
  catalog_visibility: z
    .enum(['visible', 'catalog', 'search', 'hidden'])
    .optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  sku: z.string().optional(),
  regular_price: z.string().optional(),
  sale_price: z.string().optional(),
  date_on_sale_from: z.string().optional(),
  date_on_sale_from_gmt: z.string().optional(),
  date_on_sale_to: z.string().optional(),
  date_on_sale_to_gmt: z.string().optional(),
  virtual: z.boolean().optional(),
  downloadable: z.boolean().optional(),
  downloads: z.array(AdminDownloadableFileSchema).optional(),
  download_limit: z.number().optional(),
  download_expiry: z.number().optional(),
  external_url: z.string().optional(),
  button_text: z.string().optional(),
  tax_status: z.enum(['taxable', 'shipping', 'none']).optional(),
  tax_class: z.string().optional(),
  manage_stock: z.boolean().optional(),
  stock_quantity: z.number().optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
  backorders: z.enum(['no', 'notify', 'yes']).optional(),
  low_stock_amount: z.number().optional(),
  sold_individually: z.boolean().optional(),
  weight: z.string().optional(),
  dimensions: AdminProductDimensions.optional(),
  shipping_class: z.string().optional(),
  reviews_allowed: z.boolean().optional(),
  upsell_ids: z.array(z.number()).optional(),
  cross_sell_ids: z.array(z.number()).optional(),
  parent_id: z.number().optional(),
  purchase_note: z.string().optional(),
  categories: z.array(z.object({ id: z.number() })).optional(),
  tags: z.array(z.object({ id: z.number() })).optional(),
  brands: z.array(z.object({ id: z.number() })).optional(),
  images: z.array(AdminProductImage).optional(),
  attributes: z.array(AdminProductAttributeSchema).optional(),
  default_attributes: z.array(AdminProductDefaultAttributeSchema).optional(),
  menu_order: z.number().optional(),
  meta_data: z.array(AdminProductMetaData).optional(),
});

export type AdminProductUpdateRequest = z.input<
  typeof AdminProductUpdateRequestSchema
>;

/**
 * Product query parameters for listing
 */
export const AdminProductQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  modified_after: z.string().optional(),
  modified_before: z.string().optional(),
  dates_are_gmt: z.boolean().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified', 'menu_order'])
    .optional(),
  parent: z.array(z.number()).optional(),
  parent_exclude: z.array(z.number()).optional(),
  slug: z.string().optional(),
  status: z
    .enum(['any', 'future', 'trash', 'draft', 'pending', 'private', 'publish'])
    .optional(),
  type: z.enum(['simple', 'grouped', 'external', 'variable']).optional(),
  sku: z.string().optional(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  shipping_class: z.string().optional(),
  attribute: z.string().optional(),
  attribute_term: z.string().optional(),
  on_sale: z.boolean().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']).optional(),
  include_meta: z.array(z.string()).optional(),
  exclude_meta: z.array(z.string()).optional(),
});

export type AdminProductQueryParams = z.infer<
  typeof AdminProductQueryParamsSchema
>;

/**
 * Query params for listing product custom-field names
 * Endpoint: wp-json/wc/v3/products/custom-fields/names
 */
export const AdminProductCustomFieldNameQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  search: z.string().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type ProductCustomFieldNameQueryParams = z.infer<
  typeof AdminProductCustomFieldNameQueryParamsSchema
>;
