import { z } from 'zod';

export const AdminProductReviewQueryParamsSchema = z.looseObject({
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
      'Limit response to reviews published before a given ISO8601 compliant date.'
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
    .describe('Limit result set to specific IDs.'),
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
    .enum(['date', 'date_gmt', 'id', 'include', 'product'])
    .default('date_gmt')
    .optional()
    .describe('Sort collection by object attribute.'),
  reviewer: z
    .array(z.string())
    .optional()
    .describe('Limit result set to reviews assigned to specific user IDs.'),
  reviewer_exclude: z
    .array(z.number())
    .optional()
    .describe(
      'Ensure result set excludes reviews assigned to specific user IDs.'
    ),
  reviewer_email: z
    .string()
    .optional()
    .describe('Limit result set to that from a specific author email.'),
  product: z
    .array(z.number())
    .default([])
    .optional()
    .describe('Limit result set to reviews assigned to specific product IDs.'),
  status: z
    .string()
    .default('approved')
    .optional()
    .describe('Limit result set to reviews assigned a specific status.'),
});

export type AdminProductReviewQueryParams = z.infer<
  typeof AdminProductReviewQueryParamsSchema
>;
