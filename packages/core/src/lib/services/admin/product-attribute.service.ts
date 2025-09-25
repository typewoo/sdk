import { BaseService } from '../base.service.js';
import {
  WcAdminProductAttribute,
  WcAdminProductAttributeRequest,
  WcAdminProductAttributeQueryParams,
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
export class WcAdminProductAttributeService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/attributes';

  /**
   * List product attributes
   */
  async list(
    params?: WcAdminProductAttributeQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductAttribute[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductAttribute[]>(
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
   * Get single product attribute by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminProductAttribute>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductAttribute>(url);
    return { data, error };
  }

  /**
   * Create a new product attribute
   */
  async create(
    attribute: WcAdminProductAttributeRequest
  ): Promise<ApiResult<WcAdminProductAttribute>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductAttribute,
      WcAdminProductAttributeRequest
    >(url, attribute);

    return { data, error };
  }

  /**
   * Update a product attribute
   */
  async update(
    id: number,
    attribute: WcAdminProductAttributeRequest
  ): Promise<ApiResult<WcAdminProductAttribute>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminProductAttribute,
      WcAdminProductAttributeRequest
    >(url, attribute);

    return { data, error };
  }

  /**
   * Delete a product attribute
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminProductAttribute>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminProductAttribute>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product attributes
   */
  async batch(operations: {
    create?: WcAdminProductAttributeRequest[];
    update?: Array<WcAdminProductAttributeRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminProductAttribute[];
      update: WcAdminProductAttribute[];
      delete: WcAdminProductAttribute[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductAttribute[];
        update: WcAdminProductAttribute[];
        delete: WcAdminProductAttribute[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
