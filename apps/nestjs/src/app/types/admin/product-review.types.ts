import {
  AdminProductReviewSchema,
  AdminProductReviewRequestSchema,
  AdminProductReviewQueryParamsSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminProductReview extends createZodDto(
  AdminProductReviewSchema
) {}
export class ApiAdminProductReviewRequest extends createZodDto(
  AdminProductReviewRequestSchema
) {}
export class ApiAdminProductReviewQueryParams extends createZodDto(
  AdminProductReviewQueryParamsSchema
) {}
