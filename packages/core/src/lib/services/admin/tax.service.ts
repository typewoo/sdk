import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminTaxQueryParams,
  AdminTax,
  AdminTaxRequest,
  AdminTaxClassQueryParams,
  AdminTaxClass,
  AdminTaxClassRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * WooCommerce REST API Tax Service
 *
 * Manages taxes through the WooCommerce REST API (wp-json/wc/v3/taxes)
 */
export class AdminTaxService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes';

  /**
   * List taxes
   */
  list(
    params?: AdminTaxQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminTax[], AdminTaxQueryParams> {
    const request = async (
      pageParams?: AdminTaxQueryParams
    ): Promise<ApiPaginationResult<AdminTax[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminTax[]>(url, options);
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single tax by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminTax>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTax>(url, options);
    return { data, error };
  }

  /**
   * Create a new tax
   */
  async create(
    tax: AdminTaxRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTax>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminTax, AdminTaxRequest>(
      url,
      tax,
      options
    );

    return { data, error };
  }

  /**
   * Update a tax
   */
  async update(
    id: number,
    tax: AdminTaxRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTax>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminTax, AdminTaxRequest>(
      url,
      tax,
      options
    );

    return { data, error };
  }

  /**
   * Delete a tax
   */
  async delete(
    id: number,
    force = true,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTax>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTax>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete taxes
   */
  async batch(
    operations: {
      create?: AdminTaxRequest[];
      update?: Array<AdminTaxRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminTax[];
      update: AdminTax[];
      delete: AdminTax[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminTax[];
        update: AdminTax[];
        delete: AdminTax[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}

/**
 * WooCommerce REST API Tax Classes Service
 *
 * Manages tax classes through the WooCommerce REST API (wp-json/wc/v3/taxes/classes)
 */
export class AdminTaxClassService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes/classes';

  /**
   * List tax classes
   */
  async list(
    params?: AdminTaxClassQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxClass[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxClass[]>(url, options);
    return { data, error };
  }

  /**
   * Get single tax class by slug
   */
  async get(
    slug: string,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxClass[]>> {
    const url = `/${this.endpoint}/${slug}`;

    const { data, error } = await doGet<AdminTaxClass[]>(url, options);
    return { data, error };
  }

  /**
   * Create a new tax class
   */
  async create(
    taxClass: AdminTaxClassRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminTaxClass, AdminTaxClassRequest>(
      url,
      taxClass,
      options
    );

    return { data, error };
  }

  /**
   * Delete a tax class
   */
  async delete(
    slug: string,
    force = true,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${slug}?${query}`;
    const { data, error } = await doDelete<AdminTaxClass>(url, options);

    return { data, error };
  }
}
