import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminShippingClassQueryParams,
  AdminShippingClass,
  AdminShippingClassRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

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
  list(
    params?: AdminShippingClassQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminShippingClass[], AdminShippingClassQueryParams> {
    const request = async (
      pageParams?: AdminShippingClassQueryParams
    ): Promise<ApiPaginationResult<AdminShippingClass[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminShippingClass[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single shipping class by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingClass>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminShippingClass>(url, options);
    return { data, error };
  }

  /**
   * Create a new shipping class
   */
  async create(
    shippingClass: AdminShippingClassRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminShippingClass,
      AdminShippingClassRequest
    >(url, shippingClass, options);

    return { data, error };
  }

  /**
   * Update a shipping class
   */
  async update(
    id: number,
    shippingClass: AdminShippingClassRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingClass>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminShippingClass,
      AdminShippingClassRequest
    >(url, shippingClass, options);

    return { data, error };
  }

  /**
   * Delete a shipping class
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminShippingClass>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete shipping classes
   */
  async batch(
    operations: {
      create?: AdminShippingClassRequest[];
      update?: Array<AdminShippingClassRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
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
    >(url, operations, options);

    return { data, error };
  }
}
