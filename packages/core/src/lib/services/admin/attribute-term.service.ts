import { BaseService } from '../base.service.js';
import {
  WcAdminProductAttributeTerm,
  WcAdminProductAttributeTermRequest,
  WcAdminProductAttributeTermQueryParams,
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
export class WcAdminAttributeTermService extends BaseService {
  /**
   * List attribute terms for a specific attribute
   */
  async list(
    attributeId: number,
    params?: WcAdminProductAttributeTermQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductAttributeTerm[]>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductAttributeTerm[]>(
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
  ): Promise<ApiResult<WcAdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${endpoint}/${termId}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductAttributeTerm>(url);
    return { data, error };
  }

  /**
   * Create a new attribute term
   */
  async create(
    attributeId: number,
    term: WcAdminProductAttributeTermRequest
  ): Promise<ApiResult<WcAdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductAttributeTerm,
      WcAdminProductAttributeTermRequest
    >(url, term);

    return { data, error };
  }

  /**
   * Update an attribute term
   */
  async update(
    attributeId: number,
    termId: number,
    term: WcAdminProductAttributeTermRequest
  ): Promise<ApiResult<WcAdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}/${termId}`;
    const { data, error } = await doPut<
      WcAdminProductAttributeTerm,
      WcAdminProductAttributeTermRequest
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
  ): Promise<ApiResult<WcAdminProductAttributeTerm>> {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${endpoint}/${termId}?${query}`;
    const { data, error } = await doDelete<WcAdminProductAttributeTerm>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete attribute terms
   */
  async batch(
    attributeId: number,
    operations: {
      create?: WcAdminProductAttributeTermRequest[];
      update?: Array<WcAdminProductAttributeTermRequest & { id: number }>;
      delete?: number[];
    }
  ): Promise<
    ApiResult<{
      create: WcAdminProductAttributeTerm[];
      update: WcAdminProductAttributeTerm[];
      delete: WcAdminProductAttributeTerm[];
    }>
  > {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `/${endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductAttributeTerm[];
        update: WcAdminProductAttributeTerm[];
        delete: WcAdminProductAttributeTerm[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
