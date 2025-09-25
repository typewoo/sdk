import { BaseService } from '../base.service.js';
import {
  WcAdminWebhook,
  WcAdminWebhookRequest,
  WcAdminWebhookQueryParams,
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
export class WcAdminWebhookService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/webhooks';

  /**
   * List webhooks
   */
  async list(
    params?: WcAdminWebhookQueryParams
  ): Promise<ApiPaginationResult<WcAdminWebhook[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminWebhook[]>(url);

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
  ): Promise<ApiResult<WcAdminWebhook>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminWebhook>(url);
    return { data, error };
  }

  /**
   * Create a new webhook
   */
  async create(
    webhook: WcAdminWebhookRequest
  ): Promise<ApiResult<WcAdminWebhook>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<WcAdminWebhook, WcAdminWebhookRequest>(
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
    webhook: WcAdminWebhookRequest
  ): Promise<ApiResult<WcAdminWebhook>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<WcAdminWebhook, WcAdminWebhookRequest>(
      url,
      webhook
    );

    return { data, error };
  }

  /**
   * Delete a webhook
   */
  async delete(id: number, force = true): Promise<ApiResult<WcAdminWebhook>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminWebhook>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete webhooks
   */
  async batch(operations: {
    create?: WcAdminWebhookRequest[];
    update?: Array<WcAdminWebhookRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminWebhook[];
      update: WcAdminWebhook[];
      delete: WcAdminWebhook[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminWebhook[];
        update: WcAdminWebhook[];
        delete: WcAdminWebhook[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
