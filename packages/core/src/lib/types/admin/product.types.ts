import { z } from 'zod';
import { AdminMetaData, AdminImage, AdminDimensions } from './common.types.js';

/**
 * Product category reference in product
 */
export const AdminProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductCategory = z.infer<typeof AdminProductCategorySchema>;

/**
 * Product tag reference in product
 */
export const AdminProductTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductTag = z.infer<typeof AdminProductTagSchema>;

/**
 * Product brand reference in product
 */
export const AdminProductBrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type AdminProductBrand = z.infer<typeof AdminProductBrandSchema>;

/**
 * Product attribute in product
 */
export const AdminProductAttributeSchema = z.object({
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
export const AdminProductDefaultAttributeSchema = z.object({
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
export const AdminDownloadableFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  file: z.string(),
});

export type AdminDownloadableFile = z.infer<typeof AdminDownloadableFileSchema>;

/**
 * WooCommerce REST API Product Response
 */
export const AdminProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  permalink: z.string(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  date_modified: z.string(),
  date_modified_gmt: z.string(),
  type: z.enum(['simple', 'grouped', 'external', 'variable']),
  status: z.enum(['draft', 'pending', 'private', 'publish']),
  featured: z.boolean(),
  catalog_visibility: z.enum(['visible', 'catalog', 'search', 'hidden']),
  description: z.string(),
  short_description: z.string(),
  sku: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string(),
  date_on_sale_from: z.string().nullable(),
  date_on_sale_from_gmt: z.string().nullable(),
  date_on_sale_to: z.string().nullable(),
  date_on_sale_to_gmt: z.string().nullable(),
  price_html: z.string(),
  on_sale: z.boolean(),
  purchasable: z.boolean(),
  total_sales: z.number(),
  virtual: z.boolean(),
  downloadable: z.boolean(),
  downloads: z.array(AdminDownloadableFileSchema),
  download_limit: z.number(),
  download_expiry: z.number(),
  external_url: z.string(),
  button_text: z.string(),
  tax_status: z.enum(['taxable', 'shipping', 'none']),
  tax_class: z.string(),
  manage_stock: z.boolean(),
  stock_quantity: z.number().nullable(),
  stock_status: z.enum(['instock', 'outofstock', 'onbackorder']),
  backorders: z.enum(['no', 'notify', 'yes']),
  backorders_allowed: z.boolean(),
  backordered: z.boolean(),
  low_stock_amount: z.number().nullable(),
  sold_individually: z.boolean(),
  weight: z.string(),
  dimensions: AdminDimensions,
  shipping_required: z.boolean(),
  shipping_taxable: z.boolean(),
  shipping_class: z.string(),
  shipping_class_id: z.number(),
  reviews_allowed: z.boolean(),
  average_rating: z.string(),
  rating_count: z.number(),
  upsell_ids: z.array(z.number()),
  cross_sell_ids: z.array(z.number()),
  parent_id: z.number(),
  purchase_note: z.string(),
  categories: z.array(AdminProductCategorySchema),
  tags: z.array(AdminProductTagSchema),
  brands: z.array(AdminProductBrandSchema).optional(), // Optional, depends on plugins
  images: z.array(AdminImage),
  attributes: z.array(AdminProductAttributeSchema),
  default_attributes: z.array(AdminProductDefaultAttributeSchema),
  variations: z.array(z.number()),
  grouped_products: z.array(z.number()),
  menu_order: z.number(),
  price_range: z.string().nullable(),
  meta_data: z.array(AdminMetaData),
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
export const AdminProductVariationSchema = z.object({
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
  dimensions: AdminDimensions,
  shipping_class: z.string(),
  shipping_class_id: z.number(),
  image: AdminImage,
  attributes: z.array(AdminProductDefaultAttributeSchema),
  menu_order: z.number(),
  meta_data: z.array(AdminMetaData),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductVariation = z.infer<typeof AdminProductVariationSchema>;

/**
 * Product request parameters for creating/updating
 */
export const AdminProductRequestSchema = z.object({
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
  dimensions: AdminDimensions.optional(),
  shipping_class: z.string().optional(),
  reviews_allowed: z.boolean().optional(),
  upsell_ids: z.array(z.number()).optional(),
  cross_sell_ids: z.array(z.number()).optional(),
  parent_id: z.number().optional(),
  purchase_note: z.string().optional(),
  categories: z.array(z.object({ id: z.number() })).optional(),
  tags: z.array(z.object({ id: z.number() })).optional(),
  brands: z.array(z.object({ id: z.number() })).optional(),
  images: z.array(AdminImage).optional(),
  attributes: z.array(AdminProductAttributeSchema).optional(),
  default_attributes: z.array(AdminProductDefaultAttributeSchema).optional(),
  menu_order: z.number().optional(),
  meta_data: z.array(AdminMetaData).optional(),
});

export type AdminProductRequest = z.infer<typeof AdminProductRequestSchema>;

/**
 * Product query parameters for listing
 */
export const AdminProductQueryParamsSchema = z.object({
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

export type ProductQueryParams = z.infer<typeof AdminProductQueryParamsSchema>;

/**
 * Query params for listing product custom-field names
 * Endpoint: wp-json/wc/v3/products/custom-fields/names
 */
export const AdminProductCustomFieldNameQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
  search: z.string().optional(),
  orderby: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type ProductCustomFieldNameQueryParams = z.infer<
  typeof AdminProductCustomFieldNameQueryParamsSchema
>;
