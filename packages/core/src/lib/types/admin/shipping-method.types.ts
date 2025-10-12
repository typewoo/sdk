import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AdminShippingMethodSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
    collection: z.array(z.object({ href: z.string() })),
  }),
});

export type AdminShippingMethod = z.infer<typeof AdminShippingMethodSchema>;
export class ApiAdminShippingMethod extends createZodDto(
  AdminShippingMethodSchema
) {}

export const AdminShippingMethodQueryParamsSchema = z.object({
  context: z.enum(['view']).optional(),
});

export type AdminShippingMethodQueryParams = z.infer<
  typeof AdminShippingMethodQueryParamsSchema
>;
export class ApiAdminShippingMethodQueryParams extends createZodDto(
  AdminShippingMethodQueryParamsSchema
) {}
