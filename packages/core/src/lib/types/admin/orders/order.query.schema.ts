import { z } from 'zod';

/**
 * Order query parameters for listing
 */
export const AdminOrderQueryParamsSchema = z.looseObject({
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
    .enum(['date', 'id', 'include', 'title', 'slug', 'modified'])
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
  status: z
    .enum([
      'pending',
      'processing',
      'on-hold',
      'completed',
      'cancelled',
      'refunded',
      'failed',
      'checkout-draft',
      'any',
      'trash',
    ])
    .default('any')
    .optional()
    .describe('Limit result set to orders which have specific statuses.'),
  customer: z
    .number()
    .optional()
    .describe('Limit result set to orders assigned a specific customer.'),
  product: z
    .number()
    .optional()
    .describe('Limit result set to orders assigned a specific product.'),
  dp: z
    .number()
    .default(2)
    .optional()
    .describe('Number of decimal points to use in each resource.'),
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
});

export type AdminOrderQueryParams = z.infer<typeof AdminOrderQueryParamsSchema>;
