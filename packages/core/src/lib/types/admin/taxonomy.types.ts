import { z } from 'zod';
import { AdminImage } from './common.types.js';

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
export const AdminTaxonomyCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parent: z.number(),
  description: z.string(),
  display: AdminCategoryDisplaySchema,
  image: AdminImage.nullable(),
  menu_order: z.number(),
  count: z.number(),
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
 * Product category request parameters for creating/updating
 */
export const AdminTaxonomyCategoryRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: AdminCategoryDisplaySchema.optional(),
  image: AdminImage.optional(),
  menu_order: z.number().optional(),
});

export type AdminTaxonomyCategoryRequest = z.infer<
  typeof AdminTaxonomyCategoryRequestSchema
>;

/**
 * Product category query parameters for listing
 */
export const AdminTaxonomyCategoryQueryParamsSchema = z.object({
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
export const AdminTaxonomyTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  count: z.number(),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminTaxonomyTag = z.infer<typeof AdminTaxonomyTagSchema>;

/**
 * Product tag request parameters for creating/updating
 */
export const AdminTaxonomyTagRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminTaxonomyTagRequest = z.infer<
  typeof AdminTaxonomyTagRequestSchema
>;

/**
 * Product tag query parameters for listing
 */
export const AdminTaxonomyTagQueryParamsSchema = z.object({
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
export const AdminShippingClassSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  count: z.number(),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminShippingClass = z.infer<typeof AdminShippingClassSchema>;

/**
 * Shipping class request parameters for creating/updating
 */
export const AdminShippingClassRequestSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type AdminShippingClassRequest = z.infer<
  typeof AdminShippingClassRequestSchema
>;

/**
 * Shipping class query parameters for listing
 */
export const AdminShippingClassQueryParamsSchema = z.object({
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
