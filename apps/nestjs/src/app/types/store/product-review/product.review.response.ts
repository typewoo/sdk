import { ProductReviewResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductReviewResponse extends createZodDto(
  ProductReviewResponseSchema
) {}
