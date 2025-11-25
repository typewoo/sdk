import {
  AdminRefundLineItemSchema,
  AdminRefundShippingLineSchema,
  AdminRefundTaxLineSchema,
  AdminRefundFeeLineSchema,
  AdminRefundSchema,
  AdminRefundQueryParamsSchema,
  AdminRefundCreateRequestSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminRefundLineItem extends createZodDto(
  AdminRefundLineItemSchema
) {}
export class ApiAdminRefundShippingLine extends createZodDto(
  AdminRefundShippingLineSchema
) {}
export class ApiAdminRefundTaxLine extends createZodDto(
  AdminRefundTaxLineSchema
) {}
export class ApiAdminRefundFeeLine extends createZodDto(
  AdminRefundFeeLineSchema
) {}
export class ApiAdminRefund extends createZodDto(AdminRefundSchema) {}
export class ApiAdminRefundQueryParams extends createZodDto(
  AdminRefundQueryParamsSchema
) {}
export class ApiAdminRefundCreateRequest extends createZodDto(
  AdminRefundCreateRequestSchema
) {}
