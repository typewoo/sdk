import { BaseService } from '../base.service.js';
import {
  WcAdminOrder,
  WcAdminOrderRequest,
  WcAdminOrderQueryParams,
  WcAdminOrderNote,
  WcAdminOrderNoteRequest,
  WcAdminOrderReceipt,
  WcAdminOrderReceiptRequest,
  WcAdminOrderEmailTemplate,
  WcAdminOrderSendEmailRequest,
  WcAdminOrderSendDetailsRequest,
  WcAdminOrderStatusInfo,
} from '../../types/admin/order.types.js';
import {
  WcAdminRefund,
  WcAdminRefundQueryParams,
  WcAdminRefundCreateRequest,
} from '../../types/admin/refund.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Orders Service
 *
 * Manages orders through the WooCommerce REST API (wp-json/wc/v3/orders)
 */
export class WcAdminOrderService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/orders';

  /**
   * List orders
   */
  async list(
    params?: WcAdminOrderQueryParams
  ): Promise<ApiPaginationResult<WcAdminOrder[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminOrder[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single order by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminOrder>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminOrder>(url);
    return { data, error };
  }

  /**
   * Create a new order
   */
  async create(order: WcAdminOrderRequest): Promise<ApiResult<WcAdminOrder>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<WcAdminOrder, WcAdminOrderRequest>(
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
    order: WcAdminOrderRequest
  ): Promise<ApiResult<WcAdminOrder>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<WcAdminOrder, WcAdminOrderRequest>(
      url,
      order
    );

    return { data, error };
  }

  /**
   * Delete an order
   */
  async delete(id: number, force = false): Promise<ApiResult<WcAdminOrder>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminOrder>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete orders
   */
  async batch(operations: {
    create?: WcAdminOrderRequest[];
    update?: Array<WcAdminOrderRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminOrder[];
      update: WcAdminOrder[];
      delete: WcAdminOrder[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminOrder[];
        update: WcAdminOrder[];
        delete: WcAdminOrder[];
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
  ): Promise<ApiResult<WcAdminOrderNote[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/notes${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminOrderNote[]>(url);
    return { data, error };
  }

  /**
   * Get single order note
   */
  async getNote(
    orderId: number,
    noteId: number
  ): Promise<ApiResult<WcAdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}`;
    const { data, error } = await doGet<WcAdminOrderNote>(url);
    return { data, error };
  }

  /**
   * Create order note
   */
  async createNote(
    orderId: number,
    note: WcAdminOrderNoteRequest
  ): Promise<ApiResult<WcAdminOrderNote>> {
    const url = `/${this.endpoint}/${orderId}/notes`;
    const { data, error } = await doPost<
      WcAdminOrderNote,
      WcAdminOrderNoteRequest
    >(url, note);

    return { data, error };
  }

  /**
   * Delete order note
   */
  async deleteNote(
    orderId: number,
    noteId: number,
    force = false
  ): Promise<ApiResult<WcAdminOrderNote>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/notes/${noteId}?${query}`;
    const { data, error } = await doDelete<WcAdminOrderNote>(url);

    return { data, error };
  }

  /**
   * Generate order receipt
   */
  async generateReceipt(
    orderId: number,
    params?: WcAdminOrderReceiptRequest
  ): Promise<ApiResult<WcAdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doPost<
      WcAdminOrderReceipt,
      WcAdminOrderReceiptRequest
    >(url, params || {});

    return { data, error };
  }

  /**
   * Get order receipt
   */
  async getReceipt(orderId: number): Promise<ApiResult<WcAdminOrderReceipt>> {
    const url = `/${this.endpoint}/${orderId}/receipt`;
    const { data, error } = await doGet<WcAdminOrderReceipt>(url);

    return { data, error };
  }

  /**
   * Get available email templates for orders
   */
  async getEmailTemplates(
    orderId: number
  ): Promise<ApiResult<WcAdminOrderEmailTemplate[]>> {
    const url = `/${this.endpoint}/${orderId}/actions/email_templates`;
    const { data, error } = await doGet<WcAdminOrderEmailTemplate[]>(url);

    return { data, error };
  }

  /**
   * Send order email
   */
  async sendEmail(
    orderId: number,
    params: WcAdminOrderSendEmailRequest
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_email`;
    const { data, error } = await doPost<
      { message: string },
      WcAdminOrderSendEmailRequest
    >(url, params);

    return { data, error };
  }

  /**
   * Send order details via email
   */
  async sendOrderDetails(
    orderId: number,
    params?: WcAdminOrderSendDetailsRequest
  ): Promise<ApiResult<{ message: string }>> {
    const url = `/${this.endpoint}/${orderId}/actions/send_order_details`;
    const { data, error } = await doPost<
      { message: string },
      WcAdminOrderSendDetailsRequest
    >(url, params || {});

    return { data, error };
  }

  /**
   * Get order statuses with counts
   */
  async getStatuses(): Promise<ApiResult<WcAdminOrderStatusInfo[]>> {
    const url = `/wp-json/wc/v3/orders/statuses`;
    const { data, error } = await doGet<WcAdminOrderStatusInfo[]>(url);

    return { data, error };
  }

  /**
   * List refunds for a specific order
   */
  async listRefunds(
    orderId: number,
    params?: WcAdminRefundQueryParams
  ): Promise<ApiResult<WcAdminRefund[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<WcAdminRefund[]>(url);
    return { data, error };
  }

  /**
   * Get a specific refund for an order
   */
  async getRefund(
    orderId: number,
    refundId: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminRefund>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<WcAdminRefund>(url);
    return { data, error };
  }

  /**
   * Create a refund for an order
   */
  async createRefund(
    orderId: number,
    refund: WcAdminRefundCreateRequest
  ): Promise<ApiResult<WcAdminRefund>> {
    const url = `/${this.endpoint}/${orderId}/refunds`;
    const { data, error } = await doPost<
      WcAdminRefund,
      WcAdminRefundCreateRequest
    >(url, refund);
    return { data, error };
  }

  /**
   * Delete a refund from an order
   */
  async deleteRefund(
    orderId: number,
    refundId: number,
    force = true
  ): Promise<ApiResult<WcAdminRefund>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${orderId}/refunds/${refundId}?${query}`;
    const { data, error } = await doDelete<WcAdminRefund>(url);
    return { data, error };
  }
}
