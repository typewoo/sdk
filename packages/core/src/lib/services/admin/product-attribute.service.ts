import { BaseService } from '../base.service.js';
import {
  AdminProductAttribute,
  AdminProductAttributeRequest,
  AdminProductAttributeQueryParams,
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
    params?: AdminProductAttributeQueryParams
  ): Promise<ApiPaginationResult<AdminProductAttribute[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProductAttribute[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product attribute by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminProductAttribute>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProductAttribute>(url);
    return { data, error };
  }

  /**
   * Create a new product attribute
   */
  async create(
    attribute: AdminProductAttributeRequest
  ): Promise<ApiResult<AdminProductAttribute>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminProductAttribute,
      AdminProductAttributeRequest
    >(url, attribute);

    return { data, error };
  }

  /**
   * Update a product attribute
   */
  async update(
    id: number,
    attribute: AdminProductAttributeRequest
  ): Promise<ApiResult<AdminProductAttribute>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminProductAttribute,
      AdminProductAttributeRequest
    >(url, attribute);

    return { data, error };
  }

  /**
   * Delete a product attribute
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<AdminProductAttribute>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminProductAttribute>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product attributes
   */
  async batch(operations: {
    create?: AdminProductAttributeRequest[];
    update?: Array<AdminProductAttributeRequest & { id: number }>;
    delete?: number[];
  }): Promise<
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
    >(url, operations);

    return { data, error };
  }
}
