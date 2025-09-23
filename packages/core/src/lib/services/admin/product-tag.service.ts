import { BaseService } from '../base.service.js';
import {
  WcAdminProductTag,
  WcAdminProductTagRequest,
  WcAdminProductTagQueryParams,
} from '../../types/admin/taxonomy.types.js';
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
 * WooCommerce REST API Product Tags Service
 *
 * Manages product tags through the WooCommerce REST API (wp-json/wc/v3/products/tags)
 */
export class WcAdminProductTagService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/tags';

  /**
   * List product tags
   */
  async list(
    params?: WcAdminProductTagQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductTag[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductTag[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product tag by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminProductTag>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductTag>(url);
    return { data, error };
  }

  /**
   * Create a new product tag
   */
  async create(
    tag: WcAdminProductTagRequest
  ): Promise<ApiResult<WcAdminProductTag>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductTag,
      WcAdminProductTagRequest
    >(url, tag);

    return { data, error };
  }

  /**
   * Update a product tag
   */
  async update(
    id: number,
    tag: WcAdminProductTagRequest
  ): Promise<ApiResult<WcAdminProductTag>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminProductTag,
      WcAdminProductTagRequest
    >(url, tag);

    return { data, error };
  }

  /**
   * Delete a product tag
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminProductTag>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminProductTag>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product tags
   */
  async batch(operations: {
    create?: WcAdminProductTagRequest[];
    update?: Array<WcAdminProductTagRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminProductTag[];
      update: WcAdminProductTag[];
      delete: WcAdminProductTag[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductTag[];
        update: WcAdminProductTag[];
        delete: WcAdminProductTag[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
