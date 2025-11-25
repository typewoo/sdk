import { ProductReviewRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductReviewRequest extends createZodDto(
  ProductReviewRequestSchema
) {}
