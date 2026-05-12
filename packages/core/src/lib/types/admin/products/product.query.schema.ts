import { z } from 'zod';

/**
 * Product query parameters for listing
 */
export const AdminProductQueryParamsSchema = z.looseObject({
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
    .enum([
      'date',
      'id',
      'include',
      'menu_order',
      'modified',
      'popularity',
      'post__in',
      'price',
      'random',
      'rating',
      'sales',
      'slug',
      'title',
    ])
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
    .enum(['any', 'future', 'trash', 'draft', 'pending', 'private', 'publish'])
    .default('any')
    .optional()
    .describe('Limit result set to products assigned a specific status.'),
  type: z
    .enum(['simple', 'grouped', 'external', 'variable'])
    .optional()
    .describe('Limit result set to products assigned a specific type.'),
  sku: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with specific SKU(s). Use commas to separate.'
    ),
  featured: z
    .boolean()
    .optional()
    .describe('Limit result set to featured products.'),
  category: z
    .string()
    .optional()
    .describe('Limit result set to products assigned a specific category ID.'),
  tag: z
    .string()
    .optional()
    .describe('Limit result set to products assigned a specific tag ID.'),
  shipping_class: z
    .string()
    .optional()
    .describe(
      'Limit result set to products assigned a specific shipping class ID.'
    ),
  attribute: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with a specific attribute. Use the taxonomy name/attribute slug.'
    ),
  attribute_term: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with a specific attribute term ID (required an assigned attribute).'
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
  brand: z
    .string()
    .optional()
    .describe('Limit result set to products assigned a specific brand ID.'),
  downloadable: z
    .boolean()
    .optional()
    .describe('Limit result set to downloadable products.'),
  exclude_status: z
    .array(
      z.enum(['draft', 'future', 'pending', 'private', 'publish', 'trash'])
    )
    .optional()
    .describe('Exclude products with any of the statuses from result set.'),
  exclude_types: z
    .array(z.enum(['external', 'grouped', 'simple', 'variable']))
    .optional()
    .describe('Exclude products with any of the types from result set.'),
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
    .describe('Limit result set to products with any of the statuses.'),
  include_types: z
    .array(z.enum(['external', 'grouped', 'simple', 'variable']))
    .optional()
    .describe('Limit result set to products with any of the types.'),
  pos_products_only: z
    .boolean()
    .optional()
    .describe('Limit result set to products visible in Point of Sale.'),
  search_fields: z
    .array(
      z.enum([
        'description',
        'global_unique_id',
        'name',
        'short_description',
        'sku',
      ])
    )
    .default([])
    .optional()
    .describe(
      'Limit search to specific fields when used with search parameter. Available fields: name, sku, global_unique_id, description, short_description. This argument takes precedence over all other search parameters.'
    ),
  search_name_or_sku: z
    .string()
    .optional()
    .describe(
      "Limit results to those with a name or SKU that partial matches a string. This argument takes precedence over 'search', 'sku' and 'search_sku'."
    ),
  search_sku: z
    .string()
    .optional()
    .describe(
      "Limit results to those with a SKU that partial matches a string. This argument takes precedence over 'sku'."
    ),
  virtual: z
    .boolean()
    .optional()
    .describe('Limit result set to virtual products.'),
});

export type AdminProductQueryParams = z.infer<
  typeof AdminProductQueryParamsSchema
>;

/**
 * Query params for listing product custom-field names
 * Endpoint: wp-json/wc/v3/products/custom-fields/names
 */
export const AdminProductCustomFieldNameQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  orderby: z
    .string()
    .optional()
    .describe('Sort collection by object attribute.'),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
});

export type ProductCustomFieldNameQueryParams = z.infer<
  typeof AdminProductCustomFieldNameQueryParamsSchema
>;
