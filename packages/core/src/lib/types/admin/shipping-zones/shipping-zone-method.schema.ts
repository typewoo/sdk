import { z } from 'zod';

export const AdminShippingZoneMethodSchema = z.looseObject({
  instance_id: z.number().describe('Shipping method instance ID.'),
  title: z.string().describe('Shipping method customer facing title.'),
  order: z.number().optional().describe('Shipping method sort order.'),
  enabled: z.boolean().optional().describe('Shipping method enabled status.'),
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
    .optional()
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
