import { z } from 'zod';

const AdminTaxonomyCategoryImage = z.object({
  id: z.number().describe('Image ID.'),
  date_created: z
    .string()
    .describe("The date the image was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the image was created, as GMT.'),
  date_modified: z
    .string()
    .describe("The date the image was last modified, in the site's timezone."),
  date_modified_gmt: z
    .string()
    .describe('The date the image was last modified, as GMT.'),
  src: z.string().describe('Image URL.'),
  name: z.string().describe('Image name.'),
  alt: z.string().describe('Image alternative text.'),
});

/**
 * Category display type
 */
export const AdminCategoryDisplaySchema = z.enum([
  'default',
  'products',
  'subcategories',
  'both',
]);

export type AdminCategoryDisplay = z.infer<typeof AdminCategoryDisplaySchema>;

/**
 * WooCommerce REST API Product Category Response
 */
export const AdminTaxonomyCategorySchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Category name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  parent: z.number().describe('The ID for the parent of the resource.'),
  description: z.string().describe('HTML description of the resource.'),
  display: AdminCategoryDisplaySchema,
  image: AdminTaxonomyCategoryImage.nullable().describe(
    'Category archive display type.'
  ),
  menu_order: z.number().describe('Menu order, used to custom sort the term.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })).optional(),
    })
    .optional(),
});

export type AdminTaxonomyCategory = z.infer<typeof AdminTaxonomyCategorySchema>;

/**
 * Product category request parameters for POST /products/categories.
 * `name` is required by upstream WooCommerce.
 */
export const AdminTaxonomyCategoryCreateRequestSchema = z.looseObject({
  name: z.string().describe('Category name.'),
  slug: z.string().optional(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: AdminCategoryDisplaySchema.optional(),
  image: AdminTaxonomyCategoryImage.optional(),
  menu_order: z.number().optional(),
});

export type AdminTaxonomyCategoryCreateRequest = z.input<
  typeof AdminTaxonomyCategoryCreateRequestSchema
>;

/**
 * Product category request parameters for PUT /products/categories/{id}.
 */
export const AdminTaxonomyCategoryUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: AdminCategoryDisplaySchema.optional(),
  image: AdminTaxonomyCategoryImage.optional(),
  menu_order: z.number().optional(),
});

export type AdminTaxonomyCategoryUpdateRequest = z.input<
  typeof AdminTaxonomyCategoryUpdateRequestSchema
>;

/**
 * Product category query parameters for listing
 */
export const AdminTaxonomyCategoryQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
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
    .optional(),
  hide_empty: z.boolean().optional(),
  parent: z.number().optional(),
  product: z.number().optional(),
  slug: z.string().optional(),
});

export type AdminTaxonomyCategoryQueryParams = z.infer<
  typeof AdminTaxonomyCategoryQueryParamsSchema
>;

/**
 * WooCommerce REST API Product Tag Response
 */
export const AdminTaxonomyTagSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Tag name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z.string().describe('HTML description of the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminTaxonomyTag = z.infer<typeof AdminTaxonomyTagSchema>;

/**
 * Product tag request parameters for POST /products/tags. `name` is required.
 */
export const AdminTaxonomyTagCreateRequestSchema = z.looseObject({
  name: z.string().describe('Tag name.'),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminTaxonomyTagCreateRequest = z.input<
  typeof AdminTaxonomyTagCreateRequestSchema
>;

/**
 * Product tag request parameters for PUT /products/tags/{id}.
 */
export const AdminTaxonomyTagUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminTaxonomyTagUpdateRequest = z.input<
  typeof AdminTaxonomyTagUpdateRequestSchema
>;

/**
 * Product tag query parameters for listing
 */
export const AdminTaxonomyTagQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
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
    .optional(),
  hide_empty: z.boolean().optional(),
  parent: z.number().optional(),
  product: z.number().optional(),
  slug: z.string().optional(),
});

export type AdminTaxonomyTagQueryParams = z.infer<
  typeof AdminTaxonomyTagQueryParamsSchema
>;
/**
 * WooCommerce REST API Shipping Class Response
 */
export const AdminShippingClassSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Shipping class name.'),
  slug: z
    .string()
    .describe(
      'An alphanumeric identifier for the resource unique to its type.'
    ),
  description: z.string().describe('HTML description of the resource.'),
  count: z.number().describe('Number of published products for the resource.'),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminShippingClass = z.infer<typeof AdminShippingClassSchema>;

/**
 * Shipping class request parameters for POST /products/shipping_classes.
 */
export const AdminShippingClassCreateRequestSchema = z.looseObject({
  name: z.string().describe('Shipping class name.'),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminShippingClassCreateRequest = z.input<
  typeof AdminShippingClassCreateRequestSchema
>;

/**
 * Shipping class request parameters for PUT /products/shipping_classes/{id}.
 */
export const AdminShippingClassUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminShippingClassUpdateRequest = z.input<
  typeof AdminShippingClassUpdateRequestSchema
>;

/**
 * Shipping class query parameters for listing
 */
export const AdminShippingClassQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
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
    .optional(),
  hide_empty: z.boolean().optional(),
  parent: z.number().optional(),
  product: z.number().optional(),
  slug: z.string().optional(),
});

export type AdminShippingClassQueryParams = z.infer<
  typeof AdminShippingClassQueryParamsSchema
>;
