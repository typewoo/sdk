import { BaseService } from '../base.service.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminOrderQueryParams,
  AdminOrder,
  AdminOrderRequest,
  AdminOrderNote,
  AdminOrderNoteRequest,
  AdminOrderReceiptRequest,
  AdminOrderReceipt,
  AdminOrderEmailTemplate,
  AdminOrderSendEmailRequest,
  AdminOrderSendDetailsRequest,
  AdminOrderStatusInfo,
  AdminRefundQueryParams,
  AdminRefund,
  AdminRefundCreateRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Orders Service
 *
 * Manages orders through the WooCommerce REST API (wp-json/wc/v3/orders)
 */
export class AdminOrderService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/orders';

  /**
   * List orders
   */
  async list(
    params?: AdminOrderQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminOrder[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminOrder[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single order by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrder>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrder>(url, options);
    return { data, error };
  }

  /**
   * Create a new order
   */
  async create(
    order: AdminOrderRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrder>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminOrder, AdminOrderRequest>(
      url,
      order,
      options
    );

    return { data, error };
  }

  /**
   * Update an order
   */
  async update(
    id: number,
    order: AdminOrderRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrder>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminOrder, AdminOrderRequest>(
      url,
      order,
      options
    );

    return { data, error };
  }

  /**
   * Delete an order
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrder>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminOrder>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete orders
   */
  async batch(
    operations: {
      create?: AdminOrderRequest[];
      update?: Array<AdminOrderRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminOrder[];
      update: AdminOrder[];
      delete: AdminOrder[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminOrder[];
        update: AdminOrder[];
        delete: AdminOrder[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }

  /**
   * List order notes
   */
  async listNotes(
    orderId: number,
    params?: {
      context?: 'view' | 'edit';
      type?: 'any' | 'customer' | 'internal';
    },
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderNote[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/notes${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrderNote[]>(url, options);
    return { data, error };
  }

  /**
   * Get single order note
   */
  async getNote(
    orderId: number,
    noteId: number,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}`;
    const { data, error } = await doGet<AdminOrderNote>(url, options);
    return { data, error };
  }

  /**
   * Create order note
   */
  async createNote(
    orderId: number,
    note: AdminOrderNoteRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes`;
    const { data, error } = await doPost<AdminOrderNote, AdminOrderNoteRequest>(
      url,
      note,
      options
    );

    return { data, error };
  }

  /**
   * Delete order note
   */
  async deleteNote(
    orderId: number,
    noteId: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderNote>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}?${query}`;
    const { data, error } = await doDelete<AdminOrderNote>(url, options);

    return { data, error };
  }

  /**
   * Generate order receipt
   */
  async generateReceipt(
    orderId: number,
    params?: AdminOrderReceiptRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doPost<
      AdminOrderReceipt,
      AdminOrderReceiptRequest
    >(url, params || {}, options);

    return { data, error };
  }

  /**
   * Get order receipt
   */
  async getReceipt(
    orderId: number,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doGet<AdminOrderReceipt>(url, options);

    return { data, error };
  }

  /**
   * Get available email templates for orders
   */
  async getEmailTemplates(
    orderId: number,
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderEmailTemplate[]>> {
    const url = `/${this.endpoint}/${orderId}/actions/email_templates`;
    const { data, error } = await doGet<AdminOrderEmailTemplate[]>(
      url,
      options
    );

    return { data, error };
  }

  /**
   * Send order email
   */
  async sendEmail(
    orderId: number,
    params: AdminOrderSendEmailRequest,
    options?: RequestOptions
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_email`;
    const { data, error } = await doPost<
      { message: string },
      AdminOrderSendEmailRequest
    >(url, params, options);

    return { data, error };
  }

  /**
   * Send order details via email
   */
  async sendOrderDetails(
    orderId: number,
    params?: AdminOrderSendDetailsRequest,
    options?: RequestOptions
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_order_details`;
    const { data, error } = await doPost<
      { message: string },
      AdminOrderSendDetailsRequest
    >(url, params || {}, options);

    return { data, error };
  }

  /**
   * Get order statuses with counts
   */
  async getStatuses(
    options?: RequestOptions
  ): Promise<ApiResult<AdminOrderStatusInfo[]>> {
    const url = `/wp-json/wc/v3/orders/statuses`;
    const { data, error } = await doGet<AdminOrderStatusInfo[]>(url, options);

    return { data, error };
  }

  /**
   * List refunds for a specific order
   */
  async listRefunds(
    orderId: number,
    params?: AdminRefundQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminRefund[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<AdminRefund[]>(url, options);
    return { data, error };
  }

  /**
   * Get a specific refund for an order
   */
  async getRefund(
    orderId: number,
    refundId: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminRefund>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<AdminRefund>(url, options);
    return { data, error };
  }

  /**
   * Create a refund for an order
   */
  async createRefund(
    orderId: number,
    refund: AdminRefundCreateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminRefund>> {
    const url = `/${this.endpoint}/${orderId}/refunds`;
    const { data, error } = await doPost<AdminRefund, AdminRefundCreateRequest>(
      url,
      refund,
      options
    );
    return { data, error };
  }

  /**
   * Delete a refund from an order
   */
  async deleteRefund(
    orderId: number,
    refundId: number,
    force = true,
    options?: RequestOptions
  ): Promise<ApiResult<AdminRefund>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}?${query}`;
    const { data, error } = await doDelete<AdminRefund>(url, options);
    return { data, error };
  }
}
