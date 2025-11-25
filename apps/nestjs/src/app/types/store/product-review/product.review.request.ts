import { ProductReviewRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiProductReviewRequest extends createZodDto(
  ProductReviewRequestSchema
) {}
