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
    params?: AdminOrderQueryParams
  ): Promise<ApiPaginationResult<AdminOrder[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminOrder[]>(url);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single order by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminOrder>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrder>(url);
    return { data, error };
  }

  /**
   * Create a new order
   */
  async create(order: AdminOrderRequest): Promise<ApiResult<AdminOrder>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminOrder, AdminOrderRequest>(
      url,
      order
    );

    return { data, error };
  }

  /**
   * Update an order
   */
  async update(
    id: number,
    order: AdminOrderRequest
  ): Promise<ApiResult<AdminOrder>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminOrder, AdminOrderRequest>(
      url,
      order
    );

    return { data, error };
  }

  /**
   * Delete an order
   */
  async delete(id: number, force = false): Promise<ApiResult<AdminOrder>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminOrder>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete orders
   */
  async batch(operations: {
    create?: AdminOrderRequest[];
    update?: Array<AdminOrderRequest & { id: number }>;
    delete?: number[];
  }): Promise<
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
    >(url, operations);

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
    }
  ): Promise<ApiResult<AdminOrderNote[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/notes${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminOrderNote[]>(url);
    return { data, error };
  }

  /**
   * Get single order note
   */
  async getNote(
    orderId: number,
    noteId: number
  ): Promise<ApiResult<AdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}`;
    const { data, error } = await doGet<AdminOrderNote>(url);
    return { data, error };
  }

  /**
   * Create order note
   */
  async createNote(
    orderId: number,
    note: AdminOrderNoteRequest
  ): Promise<ApiResult<AdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes`;
    const { data, error } = await doPost<AdminOrderNote, AdminOrderNoteRequest>(
      url,
      note
    );

    return { data, error };
  }

  /**
   * Delete order note
   */
  async deleteNote(
    orderId: number,
    noteId: number,
    force = false
  ): Promise<ApiResult<AdminOrderNote>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}?${query}`;
    const { data, error } = await doDelete<AdminOrderNote>(url);

    return { data, error };
  }

  /**
   * Generate order receipt
   */
  async generateReceipt(
    orderId: number,
    params?: AdminOrderReceiptRequest
  ): Promise<ApiResult<AdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doPost<
      AdminOrderReceipt,
      AdminOrderReceiptRequest
    >(url, params || {});

    return { data, error };
  }

  /**
   * Get order receipt
   */
  async getReceipt(orderId: number): Promise<ApiResult<AdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doGet<AdminOrderReceipt>(url);

    return { data, error };
  }

  /**
   * Get available email templates for orders
   */
  async getEmailTemplates(
    orderId: number
  ): Promise<ApiResult<AdminOrderEmailTemplate[]>> {
    const url = `/${this.endpoint}/${orderId}/actions/email_templates`;
    const { data, error } = await doGet<AdminOrderEmailTemplate[]>(url);

    return { data, error };
  }

  /**
   * Send order email
   */
  async sendEmail(
    orderId: number,
    params: AdminOrderSendEmailRequest
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_email`;
    const { data, error } = await doPost<
      { message: string },
      AdminOrderSendEmailRequest
    >(url, params);

    return { data, error };
  }

  /**
   * Send order details via email
   */
  async sendOrderDetails(
    orderId: number,
    params?: AdminOrderSendDetailsRequest
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_order_details`;
    const { data, error } = await doPost<
      { message: string },
      AdminOrderSendDetailsRequest
    >(url, params || {});

    return { data, error };
  }

  /**
   * Get order statuses with counts
   */
  async getStatuses(): Promise<ApiResult<AdminOrderStatusInfo[]>> {
    const url = `/wp-json/wc/v3/orders/statuses`;
    const { data, error } = await doGet<AdminOrderStatusInfo[]>(url);

    return { data, error };
  }

  /**
   * List refunds for a specific order
   */
  async listRefunds(
    orderId: number,
    params?: AdminRefundQueryParams
  ): Promise<ApiResult<AdminRefund[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<AdminRefund[]>(url);
    return { data, error };
  }

  /**
   * Get a specific refund for an order
   */
  async getRefund(
    orderId: number,
    refundId: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminRefund>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<AdminRefund>(url);
    return { data, error };
  }

  /**
   * Create a refund for an order
   */
  async createRefund(
    orderId: number,
    refund: AdminRefundCreateRequest
  ): Promise<ApiResult<AdminRefund>> {
    const url = `/${this.endpoint}/${orderId}/refunds`;
    const { data, error } = await doPost<AdminRefund, AdminRefundCreateRequest>(
      url,
      refund
    );
    return { data, error };
  }

  /**
   * Delete a refund from an order
   */
  async deleteRefund(
    orderId: number,
    refundId: number,
    force = true
  ): Promise<ApiResult<AdminRefund>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}?${query}`;
    const { data, error } = await doDelete<AdminRefund>(url);
    return { data, error };
  }
}
