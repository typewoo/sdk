import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PaginatedSchema } from '../paginated.js';

export const ProductRequestSchema = PaginatedSchema.extend({
  /**
   * Limit results to those matching a string.
   */
  search: z.string().optional(),
  /**
   * Limit result set to products with specific slug(s). Use commas to separate.
   */
  slug: z.string().optional(),
  /**
   * Limit response to resources created after a given ISO8601 compliant date.
   */
  after: z.string().optional(),
  /**
   * Limit response to resources created before a given ISO8601 compliant date.
   */
  before: z.string().optional(),
  /**
   * When limiting response using after/before, which date column to compare against.
   * Allowed values: `date`, `date_gmt`, `modified`, `modified_gmt`
   */
  date_column: z
    .enum(['date', 'date_gmt', 'modified', 'modified_gmt'])
    .optional(),
  /**
   * Ensure result set excludes specific IDs.
   */
  exclude: z.array(z.number()).optional(),
  /**
   * Limit result set to specific ids.
   */
  include: z.array(z.number()).optional(),
  /**
   * Offset the result set by a specific number of items.
   */
  offset: z.number().optional(),
  /**
   * Order sort attribute ascending or descending.
   * Allowed values: `asc`, `desc`
   */
  order: z.enum(['asc', 'desc']).optional(),
  /**
   * Sort collection by object attribute.
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
    .optional(),
  /**
   * Limit result set to those of particular parent IDs.
   */
  parent: z.array(z.number()).optional(),
  /**
   * Limit result set to all items except those of a particular parent ID.
   */
  parent_exclude: z.array(z.number()).optional(),
  /**
   * Limit result set to products assigned a specific type.
   */
  type: z
    .enum(['simple', 'grouped', 'external', 'variable', 'variation'])
    .or(z.string())
    .optional(),
  /**
   * Limit result set to products with specific SKU(s). Use commas to separate.
   */
  sku: z.string().optional(),
  /**
   * Limit result set to featured products.
   */
  featured: z.boolean().optional(),
  /**
   * Limit result set to products assigned to categories IDs or slugs, separated by commas.
   */
  category: z.string().optional(),
  /**
   * Operator to compare product category terms.
   * Allowed values: `in`, `not_in`, `and`
   */
  category_operator: z.enum(['in', 'not_in', 'and']).optional(),
  /**
   * Limit result set to products assigned to brands IDs or slugs, separated by commas.
   */
  brand: z.string().optional(),
  /**
   * Operator to compare product brand terms.
   * Allowed values: `in`, `not_in`, `and`
   */
  brand_operator: z.enum(['in', 'not_in', 'and']).optional(),
  /**
   * Limit result set to products assigned to the term ID of that custom product taxonomy.
   * `[product-taxonomy]` should be the key of the custom product taxonomy registered.
   */
  _unstable_tax_: z.array(z.record(z.string(), z.string())).optional(),
  /**
   * Operator to compare custom product taxonomy terms.
   * Allowed values: `in`, `not_in`, `and`
   */
  _unstable_tax_operator: z
    .array(z.record(z.string(), z.enum(['in', 'not_in', 'and'])))
    .optional(),
  /**
   * Limit result set to products assigned a specific tag ID.
   */
  tag: z.string().optional(),
  /**
   * Operator to compare product tags.
   * Allowed values: `in`, `not_in`, `and`
   */
  tag_operator: z.enum(['in', 'not_in', 'and']).optional(),
  /**
   * Limit result set to products on sale.
   */
  on_sale: z.boolean().optional(),
  /**
   * Limit result set to products based on a minimum price, provided using the smallest unit of the currency.
   * E.g. provide 10025 for 100.25 USD, which is a two-decimal currency, and 1025 for 1025 JPY, which is a zero-decimal currency.
   */
  min_price: z.string().optional(),
  /**
   * Limit result set to products based on a maximum price, provided using the smallest unit of the currency.
   * E.g. provide 10025 for 100.25 USD, which is a two-decimal currency, and 1025 for 1025 JPY, which is a zero-decimal currency.
   */
  max_price: z.string().optional(),
  /**
   * Limit result set to products with specified stock statuses.
   * Expects an array of strings containing `instock`, `outofstock` or `onbackorder`.
   */
  stock_status: z
    .array(z.enum(['instock', 'outofstock', 'onbackorder']))
    .optional(),
  /**
   * Limit result set to specific attribute terms.
   * Expects an array of objects containing attribute (taxonomy), `term_id` or `slug`, and optional operator for comparison.
   */
  attributes: z.array(z.enum(['attribute', 'term_id', 'slug'])).optional(),
  /**
   * The logical relationship between attributes when filtering across multiple at once.
   */
  attribute_relation: z.string().optional(),
  /**
   * Determines if hidden or visible catalog products are shown.
   * Allowed values: `any`, `visible`, `catalog`, `search`, `hidden`
   */
  catalog_visibility: z
    .enum(['any', 'visible', 'catalog', 'search', 'hidden'])
    .optional(),
  /**
   * Limit result set to products with a certain average rating.
   */
  rating: z.number().optional(),
});

export type ProductRequest = z.infer<typeof ProductRequestSchema>;
export class ApiProductRequest extends createZodDto(ProductRequestSchema) {}
