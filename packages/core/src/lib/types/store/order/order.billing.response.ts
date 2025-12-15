import { z } from 'zod';

export const OrderBillingResponseSchema = z.looseObject({
  first_name: z.string(),
  last_name: z.string(),
  company: z.string(),
  address_1: z.string(),
  address_2: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  country: z.string(),
  email: z.string(),
  phone: z.string(),
});

export type OrderBillingResponse = z.infer<typeof OrderBillingResponseSchema>;
