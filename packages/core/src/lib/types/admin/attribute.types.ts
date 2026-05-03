import { z } from 'zod';

/**
 * WooCommerce REST API Product Attribute Response
 */
export const AdminProductAttributeSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Attribute name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  type: z.enum(['select']).describe('Type of attribute.'),
  order_by: z
    .enum(['menu_order', 'name', 'name_num', 'id'])
    .describe('Default sort order.'),
  has_archives: z.boolean().describe('Enable/Disable attribute archives.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});
export type AdminProductAttribute = z.infer<typeof AdminProductAttributeSchema>;

/**
 * Product attribute request parameters for POST /products/attributes (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeCreateRequestSchema = z.looseObject({
  name: z.string().describe('Attribute name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  type: z.enum(['select']).optional().describe('Type of attribute.'),
  order_by: z
    .enum(['menu_order', 'name', 'name_num', 'id'])
    .optional()
    .describe('Default sort order.'),
  has_archives: z
    .boolean()
    .optional()
    .describe('Enable/Disable attribute archives.'),
});

export type AdminProductAttributeCreateRequest = z.input<
  typeof AdminProductAttributeCreateRequestSchema
>;

/**
 * Product attribute request parameters for PUT /products/attributes/{id}.
 */
export const AdminProductAttributeUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  type: z.enum(['select']).optional().describe('Type of attribute.'),
  order_by: z
    .enum(['menu_order', 'name', 'name_num', 'id'])
    .optional()
    .describe('Default sort order.'),
  has_archives: z
    .boolean()
    .optional()
    .describe('Enable/Disable attribute archives.'),
});

export type AdminProductAttributeUpdateRequest = z.input<
  typeof AdminProductAttributeUpdateRequestSchema
>;

/**
 * Product attribute query parameters for listing
 */
export const AdminProductAttributeQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
});

export type AdminProductAttributeQueryParams = z.infer<
  typeof AdminProductAttributeQueryParamsSchema
>;

/**
 * WooCommerce REST API Product Attribute Term Response
 */
export const AdminProductAttributeTermSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Term name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z.string().describe('HTML description of the resource.'),
  menu_order: z
    .number()
    .describe('Menu order, used to custom sort the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminProductAttributeTerm = z.infer<
  typeof AdminProductAttributeTermSchema
>;

/**
 * Product attribute term request parameters for POST .../terms (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminProductAttributeTermCreateRequestSchema = z.looseObject({
  name: z.string().describe('Term name.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
});

export type AdminProductAttributeTermCreateRequest = z.input<
  typeof AdminProductAttributeTermCreateRequestSchema
>;

/**
 * Product attribute term request parameters for PUT .../terms/{id}.
 */
export const AdminProductAttributeTermUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z
    .string()
    .optional()
    .describe('HTML description of the resource.'),
  menu_order: z
    .number()
    .optional()
    .describe('Menu order, used to custom sort the resource.'),
});

export type AdminProductAttributeTermUpdateRequest = z.input<
  typeof AdminProductAttributeTermUpdateRequestSchema
>;

/**
 * Product attribute term query parameters for listing
 */
export const AdminProductAttributeTermQueryParamsSchema = z.looseObject({
  context: z
    .enum(['view', 'edit'])
    .optional()
    .describe(
      'Scope under which the request is made; determines fields present in response.'
    ),
  page: z.number().optional().describe('Current page of the collection.'),
  per_page: z
    .number()
    .optional()
    .describe('Maximum number of items to be returned in result set.'),
  search: z
    .string()
    .optional()
    .describe('Limit results to those matching a string.'),
  exclude: z
    .array(z.number())
    .optional()
    .describe('Ensure result set excludes specific IDs.'),
  include: z
    .array(z.number())
    .optional()
    .describe('Limit result set to specific ids.'),
  offset: z
    .number()
    .optional()
    .describe(
      'Offset the result set by a specific number of items. Applies to hierarchical taxonomies only.'
    ),
  order: z
    .enum(['asc', 'desc'])
    .optional()
    .describe('Order sort attribute ascending or descending.'),
  orderby: z
    .enum([
      'id',
      'include',
      'name',
      'slug',
      'term_group',
      'description',
      'count',
    ])
    .optional()
    .describe('Sort collection by resource attribute.'),
  hide_empty: z
    .boolean()
    .optional()
    .describe('Whether to hide resources not assigned to any products.'),
  parent: z
    .number()
    .optional()
    .describe(
      'Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only.'
    ),
  product: z
    .number()
    .optional()
    .describe('Limit result set to resources assigned to a specific product.'),
  slug: z
    .string()
    .optional()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
});

export type AdminProductAttributeTermQueryParams = z.infer<
  typeof AdminProductAttributeTermQueryParamsSchema
>;
