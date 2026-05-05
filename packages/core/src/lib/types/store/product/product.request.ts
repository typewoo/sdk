import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductRequestSchema = PaginatedSchema.extend({
  context: z
    .enum(['edit', 'embed', 'view'])
    .default('view')
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  related: z
    .number()
    .optional()
    .describe('Limit result set to products related to a specific product ID.'),
  /**
   * Limit results to those matching a string.
   */
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  /**
   * Limit result set to products with specific slug(s). Use commas to separate.
   */
  slug: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with specific slug(s). Use commas to separate.'
    ),
  /**
   * Limit response to resources created after a given ISO8601 compliant date.
   */
  after: z
    .string()
    .optional()
    .describe(
      'Limit response to resources created after a given ISO8601 compliant date.'
    ),
  /**
   * Limit response to resources created before a given ISO8601 compliant date.
   */
  before: z
    .string()
    .optional()
    .describe(
      'Limit response to resources created before a given ISO8601 compliant date.'
    ),
  /**
   * When limiting response using after/before, which date column to compare against.
   * Allowed values: `date`, `date_gmt`, `modified`, `modified_gmt`
   */
  date_column: z
    .enum(['date', 'date_gmt', 'modified', 'modified_gmt'])
    .default('date')
    .optional()
    .describe(
      'When limiting response using after/before, which date column to compare against.'
    ),
  /**
   * Ensure result set excludes specific IDs.
   */
  exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  /**
   * Limit result set to specific ids.
   */
  include: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to specific ids.'),
  /**
   * Offset the result set by a specific number of items.
   */
  offset: z
    .number()
    .optional()
    .describe('Offset the result set by a specific number of items.'),
  /**
   * Order sort attribute ascending or descending.
   * Allowed values: `asc`, `desc`
   */
  order: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  /**
   * Sort collection by looseObject attribute.
   * Allowed values : `date`, `modified`, `id`, `include`, `title`, `slug`, `price`, `popularity`, `rating`, `menu_order`, `comment_count`
   */
  orderby: z
    .enum([
      'date',
      'modified',
      'id',
      'include',
      'title',
      'slug',
      'price',
      'popularity',
      'rating',
      'menu_order',
      'comment_count',
    ])
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  /**
   * Limit result set to those of particular parent IDs.
   */
  parent: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to those of particular parent IDs.'),
  /**
   * Limit result set to all items except those of a particular parent ID.
   */
  parent_exclude: z
    .array(z.number())
    .default([])
    .optional()
    .describe(
      'Limit result set to all items except those of a particular parent ID.'
    ),
  /**
   * Limit result set to products assigned a specific type.
   */
  type: z
    .enum(['external', 'grouped', 'simple', 'variable', 'variation'])
    .optional()
    .describe('Limit result set to products assigned a specific type.'),
  /**
   * Limit result set to products with specific SKU(s). Use commas to separate.
   */
  sku: z
    .string()
    .optional()
    .describe(
      'Limit result set to products with specific SKU(s). Use commas to separate.'
    ),
  /**
   * Limit result set to featured products.
   */
  featured: z
    .boolean()
    .optional()
    .describe('Limit result set to featured products.'),
  /**
   * Limit result set to products assigned to categories IDs or slugs, separated by commas.
   */
  category: z
    .string()
    .optional()
    .describe(
      'Limit result set to products assigned a set of category IDs or slugs, separated by commas.'
    ),
  /**
   * Operator to compare product category terms.
   * Allowed values: `in`, `not_in`, `and`
   */
  category_operator: z
    .enum(['in', 'not_in', 'and'])
    .default('in')
    .optional()
    .describe('Operator to compare product category terms.'),
  /**
   * Limit result set to products assigned to brands IDs or slugs, separated by commas.
   */
  brand: z
    .string()
    .optional()
    .describe(
      'Limit result set to products assigned a set of brand IDs or slugs, separated by commas.'
    ),
  /**
   * Operator to compare product brand terms.
   * Allowed values: `in`, `not_in`, `and`
   */
  brand_operator: z
    .enum(['in', 'not_in', 'and'])
    .default('in')
    .optional()
    .describe('Operator to compare product brand terms.'),
  /**
   * Limit result set to products assigned to the term ID of that custom product taxonomy.
   * `[product-taxonomy]` should be the key of the custom product taxonomy registered.
   */
  /**
   * Limit result set to products assigned a specific tag ID.
   */
  tag: z
    .string()
    .optional()
    .describe(
      'Limit result set to products assigned a set of tag IDs or slugs, separated by commas.'
    ),
  /**
   * Operator to compare product tags.
   * Allowed values: `in`, `not_in`, `and`
   */
  tag_operator: z
    .enum(['in', 'not_in', 'and'])
    .default('in')
    .optional()
    .describe('Operator to compare product tags.'),
  /**
   * Limit result set to products on sale.
   */
  on_sale: z
    .boolean()
    .optional()
    .describe('Limit result set to products on sale.'),
  /**
   * Limit result set to products based on a minimum price, provided using the smallest unit of the currency.
   * E.g. provide 10025 for 100.25 USD, which is a two-decimal currency, and 1025 for 1025 JPY, which is a zero-decimal currency.
   */
  min_price: z
    .string()
    .optional()
    .describe(
      'Limit result set to products based on a minimum price, provided using the smallest unit of the currency.'
    ),
  /**
   * Limit result set to products based on a maximum price, provided using the smallest unit of the currency.
   * E.g. provide 10025 for 100.25 USD, which is a two-decimal currency, and 1025 for 1025 JPY, which is a zero-decimal currency.
   */
  max_price: z
    .string()
    .optional()
    .describe(
      'Limit result set to products based on a maximum price, provided using the smallest unit of the currency.'
    ),
  /**
   * Limit result set to products with specified stock statuses.
   * Expects an array of strings containing `instock`, `outofstock` or `onbackorder`.
   */
  stock_status: z
    .array(z.enum(['instock', 'outofstock', 'onbackorder']))
    .default([])
    .optional()
    .describe('Limit result set to products with specified stock status.'),
  /**
   * Limit result set to specific attribute terms.
   * Expects an array of objects containing attribute (taxonomy), `term_id` or `slug`, and optional operator for comparison.
   */
  attributes: z
    .array(z.string())
    .default([])
    .optional()
    .describe('Limit result set to products with selected global attributes.'),
  /**
   * The logical relationship between attributes when filtering across multiple at once.
   */
  attribute_relation: z
    .enum(['and', 'in'])
    .default('and')
    .optional()
    .describe(
      'The logical relationship between attributes when filtering across multiple at once.'
    ),
  /**
   * Determines if hidden or visible catalog products are shown.
   * Allowed values: `any`, `visible`, `catalog`, `search`, `hidden`
   */
  catalog_visibility: z
    .enum(['any', 'visible', 'catalog', 'search', 'hidden'])
    .optional()
    .describe('Determines if hidden or visible catalog products are shown.'),
  /**
   * Limit result set to products with a certain average rating.
   */
  rating: z
    .array(z.enum(['1', '2', '3', '4', '5']))
    .default([])
    .optional()
    .describe('Limit result set to products with a certain average rating.'),
});

export type ProductRequest = z.infer<typeof ProductRequestSchema>;
