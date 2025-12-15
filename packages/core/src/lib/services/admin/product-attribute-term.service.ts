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
  AdminProductAttributeTermQueryParams,
  AdminProductAttributeTerm,
  AdminProductAttributeTermRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Attribute Terms Service
 *
 * Manages attribute terms through the WooCommerce REST API (wp-json/wc/v3/products/attributes/:attribute_id/terms)
 */
export class AdminProductAttributeTermService extends BaseService {
  /**
   * List attribute terms for a specific attribute
   */
  async list(
    attributeId: number,
    params?: AdminProductAttributeTermQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminProductAttributeTerm[]>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProductAttributeTerm[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single attribute term by ID
   */
  async get(
    attributeId: number,
    termId: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}/${termId}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProductAttributeTerm>(
      url,
      options
    );
    return { data, error };
  }

  /**
   * Create a new attribute term
   */
  async create(
    attributeId: number,
    term: AdminProductAttributeTermRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}`;
    const { data, error } = await doPost<
      AdminProductAttributeTerm,
      AdminProductAttributeTermRequest
    >(url, term, options);

    return { data, error };
  }

  /**
   * Update an attribute term
   */
  async update(
    attributeId: number,
    termId: number,
    term: AdminProductAttributeTermRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}/${termId}`;
    const { data, error } = await doPut<
      AdminProductAttributeTerm,
      AdminProductAttributeTermRequest
    >(url, term, options);

    return { data, error };
  }

  /**
   * Delete an attribute term
   */
  async delete(
    attributeId: number,
    termId: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${endpoint}/${termId}?${query}`;
    const { data, error } = await doDelete<AdminProductAttributeTerm>(
      url,
      options
    );

    return { data, error };
  }

  /**
   * Batch create/update/delete attribute terms
   */
  async batch(
    attributeId: number,
    operations: {
      create?: AdminProductAttributeTermRequest[];
      update?: Array<AdminProductAttributeTermRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminProductAttributeTerm[];
      update: AdminProductAttributeTerm[];
      delete: AdminProductAttributeTerm[];
    }>
  > {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminProductAttributeTerm[];
        update: AdminProductAttributeTerm[];
        delete: AdminProductAttributeTerm[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
