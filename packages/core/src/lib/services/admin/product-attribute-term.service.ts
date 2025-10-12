import { BaseService } from '../base.service.js';
import {
  AdminProductAttributeTerm,
  AdminProductAttributeTermRequest,
  AdminProductAttributeTermQueryParams,
} from '../../types/admin/attribute.types.js';
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
    params?: AdminProductAttributeTermQueryParams
  ): Promise<ApiPaginationResult<AdminProductAttributeTerm[]>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProductAttributeTerm[]>(
      url
    );

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single attribute term by ID
   */
  async get(
    attributeId: number,
    termId: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}/${termId}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProductAttributeTerm>(url);
    return { data, error };
  }

  /**
   * Create a new attribute term
   */
  async create(
    attributeId: number,
    term: AdminProductAttributeTermRequest
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}`;
    const { data, error } = await doPost<
      AdminProductAttributeTerm,
      AdminProductAttributeTermRequest
    >(url, term);

    return { data, error };
  }

  /**
   * Update an attribute term
   */
  async update(
    attributeId: number,
    termId: number,
    term: AdminProductAttributeTermRequest
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}/${termId}`;
    const { data, error } = await doPut<
      AdminProductAttributeTerm,
      AdminProductAttributeTermRequest
    >(url, term);

    return { data, error };
  }

  /**
   * Delete an attribute term
   */
  async delete(
    attributeId: number,
    termId: number,
    force = false
  ): Promise<ApiResult<AdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${endpoint}/${termId}?${query}`;
    const { data, error } = await doDelete<AdminProductAttributeTerm>(url);

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
    }
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
    >(url, operations);

    return { data, error };
  }
}
