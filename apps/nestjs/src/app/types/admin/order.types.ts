import {
  AdminOrderLineItemSchema,
  AdminOrderTaxLineSchema,
  AdminOrderShippingLineSchema,
  AdminOrderFeeLineSchema,
  AdminOrderCouponLineSchema,
  AdminOrderRefundSchema,
  AdminOrderSchema,
  AdminOrderRequestSchema,
  AdminOrderQueryParamsSchema,
  AdminOrderNoteSchema,
  AdminOrderNoteRequestSchema,
  AdminOrderReceiptRequestSchema,
  AdminOrderReceiptSchema,
  AdminOrderEmailTemplateSchema,
  AdminOrderSendEmailRequestSchema,
  AdminOrderSendDetailsRequestSchema,
  AdminOrderStatusInfoSchema,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminOrderLineItem extends createZodDto(
  AdminOrderLineItemSchema
) {}
export class ApiAdminOrderTaxLine extends createZodDto(
  AdminOrderTaxLineSchema
) {}
export class ApiAdminOrderShippingLine extends createZodDto(
  AdminOrderShippingLineSchema
) {}
export class ApiAdminOrderFeeLine extends createZodDto(
  AdminOrderFeeLineSchema
) {}
export class ApiAdminOrderCouponLine extends createZodDto(
  AdminOrderCouponLineSchema
) {}
export class ApiAdminOrderRefund extends createZodDto(AdminOrderRefundSchema) {}
export class ApiAdminOrder extends createZodDto(AdminOrderSchema) {}
export class ApiAdminOrderRequest extends createZodDto(
  AdminOrderRequestSchema
) {}
export class ApiAdminOrderQueryParams extends createZodDto(
  AdminOrderQueryParamsSchema
) {}
export class ApiAdminOrderNote extends createZodDto(AdminOrderNoteSchema) {}
export class ApiAdminOrderNoteRequest extends createZodDto(
  AdminOrderNoteRequestSchema
) {}
export class ApiAdminOrderReceiptRequest extends createZodDto(
  AdminOrderReceiptRequestSchema
) {}
export class ApiAdminOrderReceipt extends createZodDto(
  AdminOrderReceiptSchema
) {}
export class ApiAdminOrderEmailTemplate extends createZodDto(
  AdminOrderEmailTemplateSchema
) {}
export class ApiAdminOrderSendEmailRequest extends createZodDto(
  AdminOrderSendEmailRequestSchema
) {}
export class ApiAdminOrderSendDetailsRequest extends createZodDto(
  AdminOrderSendDetailsRequestSchema
) {}
export class ApiAdminOrderStatusInfo extends createZodDto(
  AdminOrderStatusInfoSchema
) {}
