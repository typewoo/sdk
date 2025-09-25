import { BaseService } from '../base.service.js';
import {
  WcAdminShippingClass,
  WcAdminShippingClassRequest,
  WcAdminShippingClassQueryParams,
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
 * WooCommerce REST API Shipping Classes Service
 *
 * Manages shipping classes through the WooCommerce REST API (wp-json/wc/v3/products/shipping_classes)
 */
export class WcAdminShippingClassService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/shipping_classes';

  /**
   * List shipping classes
   */
  async list(
    params?: WcAdminShippingClassQueryParams
  ): Promise<ApiPaginationResult<WcAdminShippingClass[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminShippingClass[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping class by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminShippingClass>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminShippingClass>(url);
    return { data, error };
  }

  /**
   * Create a new shipping class
   */
  async create(
    shippingClass: WcAdminShippingClassRequest
  ): Promise<ApiResult<WcAdminShippingClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminShippingClass,
      WcAdminShippingClassRequest
    >(url, shippingClass);

    return { data, error };
  }

  /**
   * Update a shipping class
   */
  async update(
    id: number,
    shippingClass: WcAdminShippingClassRequest
  ): Promise<ApiResult<WcAdminShippingClass>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminShippingClass,
      WcAdminShippingClassRequest
    >(url, shippingClass);

    return { data, error };
  }

  /**
   * Delete a shipping class
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminShippingClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminShippingClass>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete shipping classes
   */
  async batch(operations: {
    create?: WcAdminShippingClassRequest[];
    update?: Array<WcAdminShippingClassRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminShippingClass[];
      update: WcAdminShippingClass[];
      delete: WcAdminShippingClass[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminShippingClass[];
        update: WcAdminShippingClass[];
        delete: WcAdminShippingClass[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
