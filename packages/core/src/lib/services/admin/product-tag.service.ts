import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminTaxonomyTagQueryParams,
  AdminTaxonomyTag,
  AdminTaxonomyTagRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Product Tags Service
 *
 * Manages product tags through the WooCommerce REST API (wp-json/wc/v3/products/tags)
 */
export class AdminProductTagService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/tags';

  /**
   * List product tags
   */
  async list(
    params?: AdminTaxonomyTagQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminTaxonomyTag[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTaxonomyTag[]>(
      url,
      options,
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single product tag by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions,
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxonomyTag>(url, options);
    return { data, error };
  }

  /**
   * Create a new product tag
   */
  async create(
    tag: AdminTaxonomyTagRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminTaxonomyTag,
      AdminTaxonomyTagRequest
    >(url, tag, options);

    return { data, error };
  }

  /**
   * Update a product tag
   */
  async update(
    id: number,
    tag: AdminTaxonomyTagRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminTaxonomyTag,
      AdminTaxonomyTagRequest
    >(url, tag, options);

    return { data, error };
  }

  /**
   * Delete a product tag
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTaxonomyTag>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete product tags
   */
  async batch(
    operations: {
      create?: AdminTaxonomyTagRequest[];
      update?: Array<AdminTaxonomyTagRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions,
  ): Promise<
    ApiResult<{
      create: AdminTaxonomyTag[];
      update: AdminTaxonomyTag[];
      delete: AdminTaxonomyTag[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminTaxonomyTag[];
        update: AdminTaxonomyTag[];
        delete: AdminTaxonomyTag[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
