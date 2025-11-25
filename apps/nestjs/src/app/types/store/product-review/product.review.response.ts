import { ProductReviewResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductReviewResponse extends createZodDto(
  ProductReviewResponseSchema
) {}
