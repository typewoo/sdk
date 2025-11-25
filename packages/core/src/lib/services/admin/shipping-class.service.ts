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
  AdminShippingClassQueryParams,
  AdminShippingClass,
  AdminShippingClassRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Shipping Classes Service
 *
 * Manages shipping classes through the WooCommerce REST API (wp-json/wc/v3/products/shipping_classes)
 */
export class AdminShippingClassService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/shipping_classes';

  /**
   * List shipping classes
   */
  async list(
    params?: AdminShippingClassQueryParams
  ): Promise<ApiPaginationResult<AdminShippingClass[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminShippingClass[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping class by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminShippingClass>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminShippingClass>(url);
    return { data, error };
  }

  /**
   * Create a new shipping class
   */
  async create(
    shippingClass: AdminShippingClassRequest
  ): Promise<ApiResult<AdminShippingClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminShippingClass,
      AdminShippingClassRequest
    >(url, shippingClass);

    return { data, error };
  }

  /**
   * Update a shipping class
   */
  async update(
    id: number,
    shippingClass: AdminShippingClassRequest
  ): Promise<ApiResult<AdminShippingClass>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminShippingClass,
      AdminShippingClassRequest
    >(url, shippingClass);

    return { data, error };
  }

  /**
   * Delete a shipping class
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<AdminShippingClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminShippingClass>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete shipping classes
   */
  async batch(operations: {
    create?: AdminShippingClassRequest[];
    update?: Array<AdminShippingClassRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminShippingClass[];
      update: AdminShippingClass[];
      delete: AdminShippingClass[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminShippingClass[];
        update: AdminShippingClass[];
        delete: AdminShippingClass[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
