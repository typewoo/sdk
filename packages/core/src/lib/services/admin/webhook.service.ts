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
  AdminWebhookQueryParams,
  AdminWebhook,
  AdminWebhookRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

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
    params?: AdminWebhookQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminWebhook[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminWebhook[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single webhook by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminWebhook>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminWebhook>(url, options);
    return { data, error };
  }

  /**
   * Create a new webhook
   */
  async create(
    webhook: AdminWebhookRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminWebhook>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminWebhook, AdminWebhookRequest>(
      url,
      webhook,
      options
    );

    return { data, error };
  }

  /**
   * Update a webhook
   */
  async update(
    id: number,
    webhook: AdminWebhookRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminWebhook>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminWebhook, AdminWebhookRequest>(
      url,
      webhook,
      options
    );

    return { data, error };
  }

  /**
   * Delete a webhook
   */
  async delete(
    id: number,
    force = true,
    options?: RequestOptions
  ): Promise<ApiResult<AdminWebhook>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminWebhook>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete webhooks
   */
  async batch(
    operations: {
      create?: AdminWebhookRequest[];
      update?: Array<AdminWebhookRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
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
    >(url, operations, options);

    return { data, error };
  }
}
