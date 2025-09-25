import { BaseService } from '../base.service.js';
import {
  WcAdminCustomer,
  WcAdminCustomerRequest,
  WcAdminCustomerQueryParams,
} from '../../types/admin/customer.types.js';
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
 * WooCommerce REST API Customers Service
 *
 * Manages customers through the WooCommerce REST API (wp-json/wc/v3/customers)
 */
export class WcAdminCustomerService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/customers';

  /**
   * List customers
   */
  async list(
    params?: WcAdminCustomerQueryParams
  ): Promise<ApiPaginationResult<WcAdminCustomer[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminCustomer[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single customer by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminCustomer>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminCustomer>(url);
    return { data, error };
  }

  /**
   * Create a new customer
   */
  async create(
    customer: WcAdminCustomerRequest
  ): Promise<ApiResult<WcAdminCustomer>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminCustomer,
      WcAdminCustomerRequest
    >(url, customer);

    return { data, error };
  }

  /**
   * Update a customer
   */
  async update(
    id: number,
    customer: WcAdminCustomerRequest
  ): Promise<ApiResult<WcAdminCustomer>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminCustomer,
      WcAdminCustomerRequest
    >(url, customer);

    return { data, error };
  }

  /**
   * Delete a customer
   */
  async delete(
    id: number,
    force = false,
    reassign = 0
  ): Promise<ApiResult<WcAdminCustomer>> {
    const query = qs.stringify({ force, reassign }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminCustomer>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete customers
   */
  async batch(operations: {
    create?: WcAdminCustomerRequest[];
    update?: Array<WcAdminCustomerRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminCustomer[];
      update: WcAdminCustomer[];
      delete: WcAdminCustomer[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminCustomer[];
        update: WcAdminCustomer[];
        delete: WcAdminCustomer[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
