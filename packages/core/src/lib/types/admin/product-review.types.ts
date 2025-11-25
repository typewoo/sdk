import { z } from 'zod';

export const AdminProductReviewSchema = z.object({
  id: z.number(),
  date_created: z.string(),
  date_created_gmt: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  product_permalink: z.string(),
  status: z.enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash']),
  reviewer: z.string(),
  reviewer_email: z.string(),
  review: z.string(),
  rating: z.number(),
  verified: z.boolean(),
  reviewer_avatar_urls: z.object({
    '24': z.string(),
    '48': z.string(),
    '96': z.string(),
  }),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    up: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminProductReview = z.infer<typeof AdminProductReviewSchema>;

export const AdminProductReviewRequestSchema = z.object({
  product_id: z.number().optional(),
  product_name: z.string().optional(),
  status: z
    .enum(['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash'])
    .optional(),
  reviewer: z.string().optional(),
  reviewer_email: z.string().optional(),
  review: z.string().optional(),
  rating: z.number().optional(),
});

export type AdminProductReviewRequest = z.infer<
  typeof AdminProductReviewRequestSchema
>;

export const AdminProductReviewQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  search: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
  exclude: z.array(z.number()).optional(),
  include: z.array(z.number()).optional(),
  offset: z.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  orderby: z.enum(['date', 'date_gmt', 'id', 'include', 'product']).optional(),
  reviewer: z.array(z.string()).optional(),
  reviewer_exclude: z.array(z.number()).optional(),
  reviewer_email: z.string().optional(),
  product: z.array(z.number()).optional(),
  status: z.string().optional(),
});

export type AdminProductReviewQueryParams = z.infer<
  typeof AdminProductReviewQueryParamsSchema
>;
