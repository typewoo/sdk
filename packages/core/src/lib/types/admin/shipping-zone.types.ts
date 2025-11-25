import { z } from 'zod';

export const AdminShippingZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describedby: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZone = z.infer<typeof AdminShippingZoneSchema>;

export const AdminShippingZoneRequestSchema = z.object({
  name: z.string().optional(),
  order: z.number().optional(),
});

export type AdminShippingZoneRequest = z.infer<
  typeof AdminShippingZoneRequestSchema
>;

export const AdminShippingZoneQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminShippingZoneQueryParams = z.infer<
  typeof AdminShippingZoneQueryParamsSchema
>;

export const AdminShippingZoneLocationSchema = z.object({
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

export const AdminShippingZoneLocationRequestSchema = z.object({
  code: z.string(),
  type: z.enum(['postcode', 'state', 'country', 'continent']),
});

export type AdminShippingZoneLocationRequest = z.infer<
  typeof AdminShippingZoneLocationRequestSchema
>;

export const AdminShippingZoneMethodSchema = z.object({
  instance_id: z.number(),
  title: z.string(),
  order: z.number(),
  enabled: z.boolean(),
  method_id: z.string(),
  method_title: z.string(),
  method_description: z.string(),
  settings: z.record(
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
  ),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
    describes: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingZoneMethod = z.infer<
  typeof AdminShippingZoneMethodSchema
>;

export const AdminShippingZoneMethodRequestSchema = z.object({
  order: z.number().optional(),
  enabled: z.boolean().optional(),
  settings: z.record(z.string(), z.string()).optional(),
});

export type AdminShippingZoneMethodRequest = z.infer<
  typeof AdminShippingZoneMethodRequestSchema
>;

export const AdminShippingZoneMethodQueryParamsSchema = z.object({
  context: z.enum(['view', 'edit']).optional(),
});

export type AdminShippingZoneMethodQueryParams = z.infer<
  typeof AdminShippingZoneMethodQueryParamsSchema
>;
