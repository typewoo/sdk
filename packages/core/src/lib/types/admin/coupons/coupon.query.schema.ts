import { z } from 'zod';

/**
 * Coupon query parameters for listing
 */
export const AdminCouponQueryParamsSchema = z.looseObject({
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
    .optional()
    .default(false)
    .describe(
      'Whether to consider GMT post dates when limiting response by published or modified date.'
    ),
  exclude: z
    .array(z.number())
    .optional()
    .default([])
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
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
    .default('date')
    .optional()
    .describe('Sort collection by object attribute.'),
  code: z
    .string()
    .optional()
    .describe('Limit result set to resources with a specific code.'),
});

export type AdminCouponQueryParams = z.infer<
  typeof AdminCouponQueryParamsSchema
>;
