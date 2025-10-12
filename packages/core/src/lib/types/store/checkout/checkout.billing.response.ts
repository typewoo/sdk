import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CheckoutBillingResponseSchema = z.object({
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

export type CheckoutBillingResponse = z.infer<
  typeof CheckoutBillingResponseSchema
>;
export class ApiCheckoutBillingResponse extends createZodDto(
  CheckoutBillingResponseSchema
) {}
