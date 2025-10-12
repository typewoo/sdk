import { BaseService } from '../base.service.js';
import {
  AdminWebhook,
  AdminWebhookRequest,
  AdminWebhookQueryParams,
} from '../../types/admin/webhook.types.js';
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
 * WooCommerce REST API Webhooks Service
 *
 * Manages webhooks through the WooCommerce REST API (wp-json/wc/v3/webhooks)
 */
export class AdminWebhookService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/webhooks';

  /**
   * List webhooks
   */
  async list(
    params?: AdminWebhookQueryParams
  ): Promise<ApiPaginationResult<AdminWebhook[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminWebhook[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single webhook by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminWebhook>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminWebhook>(url);
    return { data, error };
  }

  /**
   * Create a new webhook
   */
  async create(webhook: AdminWebhookRequest): Promise<ApiResult<AdminWebhook>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminWebhook, AdminWebhookRequest>(
      url,
      webhook
    );

    return { data, error };
  }

  /**
   * Update a webhook
   */
  async update(
    id: number,
    webhook: AdminWebhookRequest
  ): Promise<ApiResult<AdminWebhook>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminWebhook, AdminWebhookRequest>(
      url,
      webhook
    );

    return { data, error };
  }

  /**
   * Delete a webhook
   */
  async delete(id: number, force = true): Promise<ApiResult<AdminWebhook>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminWebhook>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete webhooks
   */
  async batch(operations: {
    create?: AdminWebhookRequest[];
    update?: Array<AdminWebhookRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminWebhook[];
      update: AdminWebhook[];
      delete: AdminWebhook[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminWebhook[];
        update: AdminWebhook[];
        delete: AdminWebhook[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
