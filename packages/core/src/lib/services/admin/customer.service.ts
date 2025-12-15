import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminCustomerQueryParams,
  AdminCustomer,
  AdminCustomerRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Customers Service
 *
 * Manages customers through the WooCommerce REST API (wp-json/wc/v3/customers)
 */
export class AdminCustomerService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/customers';

  /**
   * List customers
   */
  async list(
    params?: AdminCustomerQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminCustomer[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCustomer[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single customer by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminCustomer>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminCustomer>(url, options);
    return { data, error };
  }

  /**
   * Create a new customer
   */
  async create(
    customer: AdminCustomerRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCustomer>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminCustomer, AdminCustomerRequest>(
      url,
      customer,
      options
    );

    return { data, error };
  }

  /**
   * Update a customer
   */
  async update(
    id: number,
    customer: AdminCustomerRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCustomer>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminCustomer, AdminCustomerRequest>(
      url,
      customer,
      options
    );

    return { data, error };
  }

  /**
   * Delete a customer
   */
  async delete(
    id: number,
    force = false,
    reassign = 0,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCustomer>> {
    const query = qs.stringify({ force, reassign }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminCustomer>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete customers
   */
  async batch(
    operations: {
      create?: AdminCustomerRequest[];
      update?: Array<AdminCustomerRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminCustomer[];
      update: AdminCustomer[];
      delete: AdminCustomer[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminCustomer[];
        update: AdminCustomer[];
        delete: AdminCustomer[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
