import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminProductAttributeQueryParams,
  AdminProductAttribute,
  AdminProductAttributeRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Product Attributes Service
 *
 * Manages product attributes through the WooCommerce REST API (wp-json/wc/v3/products/attributes)
 */
export class AdminProductAttributeService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/attributes';

  /**
   * List product attributes
   */
  async list(
    params?: AdminProductAttributeQueryParams,
    options?: RequestOptions,
  ): Promise<ApiPaginationResult<AdminProductAttribute[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProductAttribute[]>(
      url,
      options,
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single product attribute by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions,
  ): Promise<ApiResult<AdminProductAttribute>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProductAttribute>(url, options);
    return { data, error };
  }

  /**
   * Create a new product attribute
   */
  async create(
    attribute: AdminProductAttributeRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminProductAttribute>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminProductAttribute,
      AdminProductAttributeRequest
    >(url, attribute, options);

    return { data, error };
  }

  /**
   * Update a product attribute
   */
  async update(
    id: number,
    attribute: AdminProductAttributeRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminProductAttribute>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminProductAttribute,
      AdminProductAttributeRequest
    >(url, attribute, options);

    return { data, error };
  }

  /**
   * Delete a product attribute
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminProductAttribute>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminProductAttribute>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete product attributes
   */
  async batch(
    operations: {
      create?: AdminProductAttributeRequest[];
      update?: Array<AdminProductAttributeRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions,
  ): Promise<
    ApiResult<{
      create: AdminProductAttribute[];
      update: AdminProductAttribute[];
      delete: AdminProductAttribute[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminProductAttribute[];
        update: AdminProductAttribute[];
        delete: AdminProductAttribute[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
