import { z } from 'zod';

export const AdminShippingZoneSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  name: z.string().describe('Shipping zone name.'),
  order: z.number().describe('Shipping zone order.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describedby: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZone = z.infer<typeof AdminShippingZoneSchema>;

/**
 * Shipping zone request parameters for POST /shipping/zones (create).
 * `name` is required by upstream WooCommerce.
 */
export const AdminShippingZoneCreateRequestSchema = z.looseObject({
  name: z.string().describe('Shipping zone name.'),
  order: z.number().optional().describe('Shipping method sort order.'),
});

export type AdminShippingZoneCreateRequest = z.input<
  typeof AdminShippingZoneCreateRequestSchema
>;

/**
 * Shipping zone request parameters for PUT /shipping/zones/{id} (update).
 */
export const AdminShippingZoneUpdateRequestSchema = z.looseObject({
  name: z.string().optional(),
  order: z.number().optional().describe('Shipping method sort order.'),
});

export type AdminShippingZoneUpdateRequest = z.input<
  typeof AdminShippingZoneUpdateRequestSchema
>;

export const AdminShippingZoneQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminShippingZoneQueryParams = z.infer<
  typeof AdminShippingZoneQueryParamsSchema
>;

export const AdminShippingZoneLocationSchema = z.looseObject({
  code: z.string(),
  type: z.enum(['postcode', 'state', 'country', 'continent']),
  _links: z.object({
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneLocation = z.infer<
  typeof AdminShippingZoneLocationSchema
>;

export const AdminShippingZoneLocationRequestSchema = z.looseObject({
  code: z.string(),
  type: z.enum(['postcode', 'state', 'country', 'continent']),
});

export type AdminShippingZoneLocationRequest = z.infer<
  typeof AdminShippingZoneLocationRequestSchema
>;

export const AdminShippingZoneMethodSchema = z.looseObject({
  instance_id: z.number().describe('Shipping method instance ID.'),
  title: z.string().describe('Shipping method customer facing title.'),
  order: z.number().describe('Shipping method sort order.'),
  enabled: z.boolean().describe('Shipping method enabled status.'),
  method_id: z.string().describe('Shipping method ID.'),
  method_title: z.string().describe('Shipping method title.'),
  method_description: z.string().describe('Shipping method description.'),
  settings: z
    .record(
      z.string(),
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        type: z.string(),
        value: z.string(),
        default: z.string(),
        tip: z.string(),
        placeholder: z.string(),
      })
    )
    .describe('Shipping method settings.'),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneMethod = z.infer<
  typeof AdminShippingZoneMethodSchema
>;

/**
 * Zone method request parameters for POST /shipping/zones/{zone}/methods.
 * WooCommerce requires `method_id` to register a method on a zone.
 */
export const AdminShippingZoneMethodCreateRequestSchema = z.looseObject({
  method_id: z.string().describe('Shipping method ID.'),
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  settings: z
    .record(z.string(), z.string())
    .optional()
    .describe('Shipping method settings.'),
});

export type AdminShippingZoneMethodCreateRequest = z.input<
  typeof AdminShippingZoneMethodCreateRequestSchema
>;

/**
 * Zone method request parameters for PUT /shipping/zones/{zone}/methods/{id}.
 */
export const AdminShippingZoneMethodUpdateRequestSchema = z.looseObject({
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
  settings: z
    .record(z.string(), z.string())
    .optional()
    .describe('Shipping method settings.'),
});

export type AdminShippingZoneMethodUpdateRequest = z.input<
  typeof AdminShippingZoneMethodUpdateRequestSchema
>;

export const AdminShippingZoneMethodQueryParamsSchema = z.looseObject({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminShippingZoneMethodQueryParams = z.infer<
  typeof AdminShippingZoneMethodQueryParamsSchema
>;
