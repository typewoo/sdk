import { z } from 'zod';

/**
 * Order note
 */
export const AdminOrderNoteSchema = z.looseObject({
  id: z.number().describe('Unique identifier for the resource.'),
  author: z.string().describe('Order note author.'),
  date_created: z
    .string()
    .describe("The date the order note was created, in the site's timezone."),
  date_created_gmt: z
    .string()
    .describe('The date the order note was created, as GMT.'),
  note: z.string().optional().describe('Order note content.'),
  customer_note: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only.'
    ),
  added_by_user: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, this note will be attributed to the current user. If false, the note will be attributed to the system.'
    ),
  _links: z
    .object({
      self: z.array(z.object({ href: z.string() })),
      collection: z.array(z.object({ href: z.string() })),
      up: z.array(z.object({ href: z.string() })),
    })
    .optional(),
});

export type AdminOrderNote = z.infer<typeof AdminOrderNoteSchema>;

/**
 * Order note request parameters for POST /orders/{id}/notes (create).
 * WooCommerce order notes are append-only — no update endpoint exists.
 */
export const AdminOrderNoteCreateRequestSchema = z.looseObject({
  note: z.string().describe('Order note content.'),
  customer_note: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only.'
    ),
  added_by_user: z
    .boolean()
    .default(false)
    .optional()
    .describe(
      'If true, this note will be attributed to the current user. If false, the note will be attributed to the system.'
    ),
  order_id: z.number().optional().describe('The order ID.'),
});

export type AdminOrderNoteCreateRequest = z.input<
  typeof AdminOrderNoteCreateRequestSchema
>;
